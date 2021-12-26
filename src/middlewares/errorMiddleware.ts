import { Context, isHttpError, log, Status } from "../utils/deps.ts";
import { config } from "./../config/config.ts";

const errorMiddleware = async (ctx: Context, next: () => Promise<unknown>) => {
  try {
    await next();
  } catch (err) {
    let message = err.message;
    const status = err.status || err.statusCode || Status.InternalServerError;

    /**
     * considering all unhandled errors as internal server error,
     * do not want to share internal server errors to
     * end user in non "development" mode
     */
    if (!isHttpError(err)) {
      message = config.ENV === "dev" || config.ENV === "development"
        ? message
        : "Internal Server Error";
    }

    if (config.ENV === "dev" || config.ENV === "development") {
      log.error(err);
    }

    ctx.response.status = status;
    ctx.response.body = { status, message };
  }
};

export { errorMiddleware };
