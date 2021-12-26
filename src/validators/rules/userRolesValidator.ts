import { validasaur } from "../../utils/deps.ts";
import { UserRole, UserRoles } from "../../types/user/userTypes.ts";

/**
 * Validate the roles values
 */
export function validRolesRule(
  value: UserRole | UserRole[],
): validasaur.Validity {
  let userRoles: UserRole[] = [];
  if (typeof value === "string") {
    userRoles = value.split(",") as UserRole[];
  }
  if (Array.isArray(value)) {
    userRoles = value;
  }
  if (userRoles.length === 0) {
    return validasaur.invalid("roles", { userRoles });
  }
  for (const role of userRoles) {
    if (!UserRoles.includes(role)) {
      return validasaur.invalid("roles", { userRoles });
    }
  }
}
