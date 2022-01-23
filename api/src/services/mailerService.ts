import { config } from "../config/config.ts";
import { ResetSchema } from "../schemas/schemas.ts";
import { ResetRequest } from "../types/reset/resetPasswordTypes.ts";
import { ResponseUser } from "../types/user/userTypes.ts";
import { join, log, SendConfig, SmtpClient } from "../utils/deps.ts";

export class MailerService {
  static async sendRegistered(
    userData: ResponseUser,
  ) {
    const subject = "New Registration";

    const location = JSON.parse(Deno.env.get("location") ?? "{}");
    const content =
      `Received a registration event from ${userData.name} with the email: ${userData.email} on ${
        new Date().toUTCString()
      }`;

    try {
      await this.smtpSend({
        from: config.SMTP_USERNAME,
        to: config.SMTP_USERNAME,
        subject,
        content,
      });
    } catch (err) {
      log.critical(
        `Internal Error sending registration confirmation email: ${err}`,
      );
    }
    return content;
  }

  static async sendResetRequest(
    resetInformation: ResetSchema,
    requestResetData: ResetRequest,
  ) {
    const subject = "Reset Your Password";

    const location = JSON.parse(Deno.env.get("location") ?? "{}");
    const resetURL = requestResetData?.resetURL ?? location.href;
    const url = join(resetURL, resetInformation.token);
    const content = `Click <a href="${url}" >here</a> to reset your password!`;

    try {
      await this.smtpSend({
        from: config.SMTP_USERNAME,
        to: requestResetData.email,
        subject,
        content,
        html: content,
      });
    } catch (err) {
      log.critical(
        `Internal Error sending forgot password confirmation email: ${err}`,
      );
    }

    return content;
  }

  static async smtpSend(infoToSend: SendConfig) {
    const client = new SmtpClient();

    const connectConfig: any = {
      hostname: config.SMTP_SERVER,
      port: config.SMTP_PORT_SSL,
      fullname: config.SMTP_FULL_NAME,
      username: config.SMTP_USERNAME,
      password: config.SMTP_PASSWORD,
    };

    await client.connectTLS(connectConfig);

    console.log(infoToSend);
    await client.send(infoToSend);

    await client.close();
  }
}
