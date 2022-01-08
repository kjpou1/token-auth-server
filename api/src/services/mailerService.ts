import { ResetSchema } from "../schemas/schemas.ts";
import { ResetRequest } from "../types/reset/resetPasswordTypes.ts";
export class MailerService {
  static sendResetRequest(
    resetInformation: ResetSchema,
    requestResetData: ResetRequest,
  ) {
    const subject = "Reset Your Password";

    const location = JSON.parse(Deno.env.get("location") ?? "{}");
    const resetURL = requestResetData?.resetURL ?? location.href;
    const url = `${resetURL}${resetInformation.token}`;
    const content = `Click <a href="${url}" >here</a> to reset your password!`;

    return content;
  }
}
