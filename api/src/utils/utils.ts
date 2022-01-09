import { config } from "../config/config.ts";
import { UserSchema } from "../schemas/schemas.ts";
import { TokenRequestService, TokenService } from "../services/services.ts";
import { RefreshToken } from "../types/authentication/tokenTypes.ts";
import { ResponseUser, UserRole } from "../types/user/userTypes.ts";
import { Cookies, join, log, omit } from "./deps.ts";
const { JWT_SECRET_FILE, JWT_COOKIE_NAME } = config;

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
  if (user) {
    const responseUser = omit(
      user,
      ["password"],
    );
    return responseUser;
  }
  return null;
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

export async function setCookieInfo(
  cookies: Cookies,
  token: string | undefined,
  expires: Date,
) {
  await cookies.set(JWT_COOKIE_NAME, token ?? "", {
    httpOnly: true,
    secure: JSON.parse(Deno.env.get("location") ?? "{}").secure ?? false,
    expires: expires,
  });
}

export async function cleanUpRefreshToken(
  cookies: Cookies,
  refreshToken: RefreshToken | undefined,
) {
  if (refreshToken) {
    log.debug(`Cleaning up refresh token: ${refreshToken.jti} `);
    await TokenService.expireCurrentToken(refreshToken.jti);
    await TokenRequestService.removeTokenRequestInformation(
      refreshToken.jti,
    );
  }
  cookies.delete(JWT_COOKIE_NAME);
}
