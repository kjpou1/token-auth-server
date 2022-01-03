import { TokenService } from "../services/services.ts";
import { Context } from "../utils/deps.ts";

// Authorization middleware that checks that
// the "Authorization" cookie is present
// and that the token is valid
export const bearerAuthMiddleware = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
  const { request, state } = ctx;
  // Retrieve the request's headers
  const { headers } = request;
  // // Attempt to get the "Authorization" header if it exists
  const authorizationHeader = headers.get("Authorization");

  // If there is an "Authorization" header
  // and it starts with the prefix "Bearer "
  if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
    // Extract the JWT from the header
    const jwtToken = authorizationHeader?.substr("Bearer ".length) ?? "";
    // Verify that the JWT is valid, if not return 401
    try {
      const payload = await TokenService.getJwtPayload(jwtToken);
      if (payload?.sub) {
        //console.log(payload);
        state.user = JSON.parse(payload?.sub);
        state.bearerJti = payload?.jti;
      }
    } catch { /* intentionally left blank */ }
  }
  // Token is valid, proceed with the next middleware
  await next();
};
