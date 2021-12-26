import { Context, log } from "../utils/deps.ts";

const loggerMiddleware = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
  await next();
  const time = ctx.response.headers.get("X-Response-Time");
  log.info(`${ctx.request.method} ${ctx.request.url}: ${time}`);
};

export { loggerMiddleware };
