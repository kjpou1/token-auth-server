import { httpErrors, RouterContext } from "../utils/deps.ts";
import { UserRole } from "./../types/user/userTypes.ts";
import { isInRole } from "../utils/utils.ts";

/**
 * the authorize middleware supports role-based and policy-based authorization.
 * For role-based authorization, use the roles parameter:
 * checks authorization for context user, user roles
 */
const authorize = (roles?: UserRole | UserRole[]) => {
  return async (ctx: RouterContext<"">, next: () => Promise<unknown>) => {
    // if auth user not found, throw error
    const { user, refreshToken } = ctx.state;
    if (!user || !refreshToken) {
      const location = JSON.parse(Deno.env.get("location") ?? "{}");
      throw new httpErrors.Forbidden(
        `Unauthorized ${location.secure ? "HTTPS" : "HTTP"}`,
      );
    }

    //console.log(roles);

    //if roles specified, then check auth user's roles
    if (roles) {
      const isRoleMatched = isInRole(user, roles);

      //if no role mached throw forbidden error
      if (!isRoleMatched) {
        throw new httpErrors.Forbidden("Forbidden user role");
      }
    }

    await next();
  };
};

export { authorize };
