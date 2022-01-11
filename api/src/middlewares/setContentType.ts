import { Context } from "../utils/deps.ts";

const setContentType = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
  await next();

  // If the content-type explicitly set already then do not replace it
  if (!ctx.response.headers.get("content-type")) {
    ctx.response.headers.set("Content-Type", "application/json");
  }
};

export { setContentType };
