import { Context } from "../utils/deps.ts";

const setContentType = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
  await next();
  ctx.response.headers.set("Content-Type", "application/json");
};

export { setContentType };
