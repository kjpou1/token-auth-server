import {
  Bson,
  helpers,
  httpErrors,
  RouterContext,
  RouterMiddleware,
} from "../utils/deps.ts";
import { createResponseUser } from "../utils/utils.ts";
import { UserSchema } from "../schemas/schemas.ts";
import { UserService } from "../services/services.ts";
import { Pagination } from "../types/filterandpagination/FilterAndPaginationTypes.ts";
import {
  authorize,
  requestParametersValidator,
  requestValidator,
} from "../middlewares/middlewares.ts";
import { UserRole } from "../types/user/userTypes.ts";
import { paginationValidationSchema } from "../validators/request-parameter-validations.ts";
import { updateUserValidationSchema } from "../validators/request-validations.ts";

/**
 * Get Users
 */
export const GetUsers: [
  RouterMiddleware<"">,
  RouterMiddleware<"">,
  RouterMiddleware<"users">,
] = [
  /** authorization and user role access policy middleware */
  authorize([UserRole.SUPER, UserRole.ADMIN]),
  //authorize(),
  /** request parameters validation middleware */
  requestParametersValidator({
    parameterRules: paginationValidationSchema,
  }),
  /** router handler */
  async (
    ctx: RouterContext<"users">,
  ) => {
    const pagination: Pagination = helpers.getQuery(ctx, {
      mergeParams: true,
    });

    const usersCursor = await UserService.getUsers(pagination);
    ctx.response.body = usersCursor;
  },
];

/**
 * Get User by id
 */
export const GetUserById: [
  RouterMiddleware<"">,
  RouterMiddleware<"users/:id">,
] = [
  /** authorization and user role access policy middleware */
  authorize([UserRole.SUPER, UserRole.ADMIN]),
  /** Get user handler */
  async (
    ctx: RouterContext<"users/:id">,
  ) => {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    if (id) {
      const userData = createResponseUser(
        await UserService.getUserById(new Bson.ObjectId(id)) as UserSchema,
      );
      ctx.response.body = userData;
    } else {
      throw new httpErrors.NotFound("User not found");
    }
  },
];

/**
 * Update User by Id
 */
export const UpdateUserById: [
  RouterMiddleware<"">,
  RouterMiddleware<"">,
  RouterMiddleware<"users">,
] = [
  /** authorization and user role access policy middleware */
  authorize([UserRole.SUPER, UserRole.ADMIN]),
  /** request validation middleware */
  requestValidator({ bodyRules: updateUserValidationSchema }),
  async (
    ctx: RouterContext<"users">,
  ) => {
    /** get user id from params */
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    if (id) {
      const { request, response } = ctx;
      // make sure we do not include the _id if it was specified
      // in the body.  This can cause problems when trying to update
      // the database entry
      const { _id, ...userData } = await request.body().value;
      const updateUser = await UserService.updateUserById(
        new Bson.ObjectId(id),
        userData,
      );
      if (updateUser) {
        const user = createResponseUser(
          updateUser,
        );
        response.body = user;
        return;
      }
    }
    throw new httpErrors.BadRequest(
      "Something went wrong updating information",
    );
  },
];

/**
 * Delete User by Id
 */
export const DeleteUserById: [
  RouterMiddleware<"">,
  RouterMiddleware<"users/:id">,
] = [
  /** authorization and user role access policy middleware */
  authorize([UserRole.SUPER, UserRole.ADMIN]),
  async (
    ctx: RouterContext<"users/:id">,
  ) => {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    if (id) {
      const userData = await UserService.deleteById(new Bson.ObjectId(id));
      ctx.response.body = {
        status: 204,
        message: "success",
      };
    } else {
      throw new httpErrors.NotFound("User not found");
    }
  },
];
