import { Context, log } from "../utils/deps.ts";
import { config } from "../config/config.ts";
import { TokenService } from "../services/services.ts";

// Authorization middleware that checks that
// the "Authorization" cookie is present
// and that the token is valid
export const httpOnlyCookieAuthMiddleware = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
  const { cookies, state } = ctx;
  const jwtToken = await cookies.get(config.JWT_COOKIE_NAME) ?? "";
  if (jwtToken) {
    const payload = await TokenService.getJwtPayload(jwtToken);
    if (payload) {
      state.refreshToken = payload;
    }
  }

  // Token is valid, proceed with the next middleware
  await next();
};
