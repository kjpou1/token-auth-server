import { join, log, omit } from "./deps.ts";
import { ResponseUser, UserRole } from "../types/user/userTypes.ts";
import { UserSchema } from "../schemas/schemas.ts";
import { config } from "../config/config.ts";
const { JWT_SECRET_FILE } = config;

export async function getBannerText() {
  const path = join("data", "banner.txt");
  const result = await Deno.readTextFile(path);
  return result;
}

function ensureSecretKeyFileExists() {
  try {
    const fileInfo = Deno.statSync(JWT_SECRET_FILE);
    if (!fileInfo.isFile) {
      log.critical(
        "Internal Server Error: Crypto Key file not found.  Please generate a file and retry.",
      );
    }
  } catch {
    log.critical(
      "Internal Server Error: Crypto Key file not found.  Please generate a file and retry.",
    );
  }
}

export function ensureEnvironment() {
  ensureSecretKeyFileExists();
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
