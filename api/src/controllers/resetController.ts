import { helpers, httpErrors } from "../utils/deps.ts";
import { RouterContext, RouterMiddleware } from "../utils/deps.ts";
import { ResetService, UserService } from "../services/services.ts";
import { requestValidator } from "../middlewares/middlewares.ts";
import {
  resetRequestValidationSchema,
  resetValidationSchema,
} from "../validators/request-validations.ts";
import {
  ResetConfirmation,
  ResetRequest,
} from "../types/reset/resetPasswordTypes.ts";

export const RequestReset: [
  RouterMiddleware<"">,
  RouterMiddleware<"request_reset">,
] = [
  /** request validation middleware */
  requestValidator({ bodyRules: resetRequestValidationSchema }),
  /** router handler */
  async (
    { request, response }: RouterContext<"request_reset">,
  ) => {
    const requestResetData = await request.body().value as ResetRequest;

    const resetInformation = await ResetService.createResetRequest(
      requestResetData,
    );

    const subject = "Reset Your Password";

    const location = JSON.parse(Deno.env.get("location") ?? "{}");
    const url = `${location.href}/reset/${resetInformation.token}`;
    const content = `Click <a href="${url}" >here</a> to reset your password!`;

    //await Mailer.send(email, subject, content);

    response.body = {
      status: 200,
      message: "Check your email",
      content: content,
    };
  },
];

export const Reset: [
  RouterMiddleware<"">,
  RouterMiddleware<"reset/:requestId">,
] = [
  /** request validation middleware */
  requestValidator({ bodyRules: resetValidationSchema }),
  /** router handler */
  async (
    ctx: RouterContext<"reset/:requestId">,
  ) => {
    const { response, request } = ctx;

    /** get user id from params */
    const { requestId } = helpers.getQuery(ctx, { mergeParams: true });
    if (requestId) {
      // get original request
      const original = await ResetService.getResetRequest(requestId);
      if (!original) {
        throw new httpErrors.BadRequest("Request not found");
      }
      // Check for expiration of request
      if (!original.expiresOn) {
        throw new httpErrors.BadRequest("Request has expired");
      }
      // Using now and getTime() to compare Number of milliseconds since January 1, 1970 00:00:00.
      if (Date.now() > original.expiresOn.getTime()) {
        throw new httpErrors.BadRequest("Request has expired");
      }

      // Now that the original request has been validated let's do one
      // more check for the passwords.
      const resetData = await request.body().value as ResetConfirmation;
      if (resetData.password !== resetData.passwordConfirm) {
        throw new httpErrors.BadRequest("Passwords do not match!");
      }

      const passwordUpdated = await UserService.updateUserPasswordByEmail(
        original.email,
        resetData.password,
      );
      if (!passwordUpdated) {
        throw new httpErrors.InternalServerError(
          "Request not fulfilled.  Please try again.",
        );
      }

      const deletedCount = await ResetService.removeResetRequest(original._id);
      if (deletedCount != 1) {
        throw new httpErrors.NotFound("User not found");
      }

      response.body = {
        status: 200,
        message: "Success",
      };
      return;
    }
    throw new httpErrors.BadRequest("Request not found");
  },
];