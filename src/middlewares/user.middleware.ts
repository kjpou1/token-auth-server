import { httpErrors, RouterMiddleware } from "../utils/deps.ts";
import { JwtService } from "../services/JwtService.ts";

// User middleware that fulfills
// requests about the user
export const userMiddleware: RouterMiddleware<""> = async (
  { cookies, state },
  next,
) => {
  const jwtToken = await cookies.get("jwt") ?? "";
  const payload = await JwtService.getJwtPayload(jwtToken);
  if (!payload) {
    throw new httpErrors.Unauthorized("Unauthenticated");
  }
  state.user = payload;

  // Token is valid, proceed with the next middleware
  await next();
};
