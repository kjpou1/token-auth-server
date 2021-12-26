import { httpErrors } from "../utils/deps.ts";
/**
 * Route middleware for routes that aren't found
 */
export const notFoundMiddleware = () => {
  throw new httpErrors.NotFound("Not Found");
};
