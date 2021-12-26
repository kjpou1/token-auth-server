import { dotenv, join, omit } from "./deps.ts";
import { ResponseUser, UserRole } from "../types/user/userTypes.ts";
import { UserSchema } from "../schemas/schemas.ts";

export async function getBannerText() {
  const path = join("data", "banner.txt");
  const result = await Deno.readTextFile(path);
  return result;
}

export function ensureEnvironment() {
  // Import environment variables from the ".env" file
  // and ensure all the variables are defined
  dotenv.config({ safe: true, export: true });
  const missingEnvVars = [];

  // Double check that the the "MONGODB_URI" is defined
  if (typeof Deno.env.get("MONGODB_URI") !== "string") {
    missingEnvVars.push("MONGODB_URI");
  }

  // Double check that the the "JWT_SECRET" is defined
  if (typeof Deno.env.get("JWT_SECRET") !== "string") {
    missingEnvVars.push("JWT_SECRET");
  }

  // Double check that the the "JWT_ACCESS_TOKEN_EXP" is defined
  if (typeof Deno.env.get("JWT_ACCESS_TOKEN_EXP") !== "string") {
    missingEnvVars.push("JWT_ACCESS_TOKEN_EXP");
  }
  // Double check that the the "JWT_REFRESH_TOKEN_EXP" is defined
  if (typeof Deno.env.get("JWT_REFRESH_TOKEN_EXP") !== "string") {
    missingEnvVars.push("JWT_REFRESH_TOKEN_EXP");
  }
  // Double check that the the "JWT_REFRESH_TOKEN_EXP" is defined
  if (typeof Deno.env.get("JWT_COOKIE_NAME") !== "string") {
    missingEnvVars.push("JWT_COOKIE_NAME");
  }
  // If any environment variable is missing throw an error
  if (missingEnvVars.length > 0) {
    throw new Error(
      `The following environment variables are missing: ${
        missingEnvVars.join(
          ", ",
        )
      }`,
    );
  }
}

export function createResponseUser(user: UserSchema) {
  const responseUser = omit(
    user,
    ["password"],
  );
  return responseUser;
}

export function createTokenPayload(user: UserSchema) {
  const tokenPayload = { _id: user._id, roles: user.roles };
  return tokenPayload;
}

export const isInRole = (
  user: ResponseUser,
  roles: UserRole | UserRole[],
) => {
  if (!user.roles) {
    return false;
  }
  const userRoles = user.roles.join(",").split(",")
    .map((role) => role.trim());

  if (typeof (roles) == "string") {
    roles = [roles];
  }

  let isRoleMatched = false;
  roles.forEach((role) => {
    if (userRoles.includes(role)) {
      isRoleMatched = true;
    }
  });

  return isRoleMatched;
};
