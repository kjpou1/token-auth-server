import { config } from "../config/config.ts";
import { authorize, requestValidator } from "../middlewares/middlewares.ts";
import { UserSchema } from "../schemas/schemas.ts";
import {
  EncryptionService,
  TokenService,
  UserService,
} from "../services/services.ts";
import {
  CreateTokens,
  RefreshToken,
} from "../types/authentication/tokenTypes.ts";
import {
  CreateUser,
  LoginUserResponse,
  UserRole,
} from "../types/user/userTypes.ts";
import {
  Bson,
  Cookies,
  helpers,
  httpErrors,
  log,
  Response,
  RouterContext,
  RouterMiddleware,
} from "../utils/deps.ts";
import {
  createResponseUser,
  createTokenPayload,
  setCookieInfo,
} from "../utils/utils.ts";
import { createUserValidationSchema } from "../validators/request-validations.ts";
const {
  JWT_REFRESH_TOKEN_EXP,
  JWT_COOKIE_NAME,
  JWT_ACCESS_TOKEN_NAME,
  JWT_REFRESH_TOKEN_NAME,
  AUTH_TOKEN_TYPE,
  JWT_ACCESS_TOKEN_EXP,
} = config;

export const Register: [
  //RouterMiddleware<"">,
  RouterMiddleware<"">,
  RouterMiddleware<"/api/v1/register">,
] = [
  /** authorization and user role access policy middleware */
  //authorize(),
  /** request validation middleware */
  requestValidator({ bodyRules: createUserValidationSchema }),
  async (
    { request, response }: RouterContext<"/api/v1/register">,
  ) => {
    const user = await request.body().value as CreateUser;
    if (await UserService.getUserByEmail(user.email)) {
      throw new httpErrors.BadRequest(
        `User already exists with email: ${user.email}`,
      );
    }
    const userData = createResponseUser(
      await UserService.createUser(user) as UserSchema,
    );

    response.body = {
      code: "success",
      status: 200,
      message: "success",
      details: userData,
    };
  },
];

export const Login = async (
  { request, response, cookies }: RouterContext<"login">,
) => {
  const { email, password } = await request.body().value;
  const user = await UserService.getUserByEmail(email);
  if (!user) {
    throw new httpErrors.NotFound("User or password not valid.");
  }

  // Check if the user's account has been blocked. The user can be automatically blocked
  // if data compromise is detected.
  if (user.blockedOn) {
    throw new httpErrors.Forbidden("Your account is temporarily disabled.");
  }

  if (!await EncryptionService.compare(password, user.password)) {
    throw new httpErrors.Unauthorized("User or password not valid.");
  }

  await setAuthResponse(response, cookies, user);
};

async function setAuthResponse(
  response: Response,
  cookies: Cookies,
  user: UserSchema,
  refreshToken?: RefreshToken,
) {
  /**
   *   o  MUST NOT extend the lifetime of the new refresh token beyond the
   *   lifetime of the initial refresh token
   *
   *   o  upon issuing a rotated refresh token, MUST NOT extend the lifetime
   *   of the new refresh token beyond the lifetime of the initial
   *   refresh token if the refresh token has a preestablished expiration time
   */

  let tokens = {} as CreateTokens;
  let lifeTime = Number(JWT_REFRESH_TOKEN_EXP);

  if (refreshToken) {
    tokens = await TokenService.createRotatedTokens(
      createTokenPayload(user),
      refreshToken,
    ) as CreateTokens;

    // Calculate the new cookie lifetime based off of the rotated refresh token
    // expiration date.
    lifeTime = Math.floor(Math.abs(
      (new Date().getTime() - new Date(refreshToken.exp * 1000).getTime()) /
        1000,
    ));
  } else {
    tokens = await TokenService.createTokens(
      createTokenPayload(user),
    ) as CreateTokens;
  }

  // calculate the expiration date of the refresh token httpOnly Cookie
  const expd = new Date();
  expd.setTime(expd.getTime() + lifeTime * 1000);

  // set the cookie information.
  await setCookieInfo(cookies, tokens.refreshToken, expd);

  const responseTokens: Record<string, string | undefined> = {};
  responseTokens[JWT_ACCESS_TOKEN_NAME] = tokens.accessToken;
  responseTokens[JWT_REFRESH_TOKEN_NAME] = tokens.refreshToken;

  const loginResponse: LoginUserResponse = {
    ...responseTokens,
    jti: tokens.jti,
    tokenType: AUTH_TOKEN_TYPE,
    expiresIn: Number(JWT_ACCESS_TOKEN_EXP),
    user: createResponseUser(user),
  };

  response.body = {
    code: "success",
    status: 200,
    message: "success",
    details: loginResponse,
  };
}

export const Me: [
  RouterMiddleware<"">,
  RouterMiddleware<"user">,
] = [
  /** authorization and user role access policy middleware */
  authorize([UserRole.SUPER, UserRole.ADMIN]),
  async (
    { response, state }: RouterContext<"user">,
  ) => {
    const { user } = state;
    if (!user) {
      throw new httpErrors.Unauthorized("Unauthenticated");
    }
    const userData = createResponseUser(
      await UserService.getUserById(new Bson.ObjectId(user._id)) as UserSchema,
    );
    response.body = {
      code: "success",
      status: 200,
      message: "success",
      details: userData,
    };
  },
];

export const Logout: [
  RouterMiddleware<"logout">,
] = [
  (
    { response, cookies }: RouterContext<"logout">,
  ) => {
    log.debug(`Logging out and deleting cookie: ${JWT_COOKIE_NAME} `);
    cookies.delete(JWT_COOKIE_NAME);
    response.body = {
      code: "success",
      status: 200,
      message: "success",
    };
  },
];

export const Token: [
  RouterMiddleware<"token">,
] = [
  async (
    { response, cookies, state }: RouterContext<"token">,
  ) => {
    const refreshToken: RefreshToken = state.refreshToken;
    if (refreshToken) {
      log.debug("Refreshing access token");
      const rotationValid = await TokenService.validateRotationToken(
        refreshToken,
      );
      if (!rotationValid) {
        throw new httpErrors.Unauthorized(
          "Refresh token is invalid or expired.",
        );
      }
      if (refreshToken.sub) {
        const user = JSON.parse(refreshToken.sub) as UserSchema;
        await TokenService.expireCurrentToken(state.jti);
        await setAuthResponse(response, cookies, user, refreshToken);
      }
    } else {
      log.debug(`Logging out and deleting cookie: ${JWT_COOKIE_NAME} `);
      cookies.delete(JWT_COOKIE_NAME);
      throw new httpErrors.Unauthorized("Refresh token is invalid or expired.");
    }
  },
];

export const TokenResult: [
  RouterMiddleware<"token/:resultId">,
] = [
  async (
    ctx: RouterContext<"token/:resultId">,
  ) => {
    const { response, request, cookies } = ctx;

    /** get user id from params */
    const { resultId } = helpers.getQuery(ctx, { mergeParams: true });
    if (resultId) {
      const tokenInfo = await TokenService.getTokenResult(resultId);
      if (tokenInfo?.expiresOn) {
        let accessTokenlifeTime = 0;
        let lifeTime = 0;

        const accessToken = await TokenService.getJwtPayload(
          tokenInfo.associatedToken ?? "",
        );
        if (accessToken?.exp) {
          // Calculate the new cookie lifetime based off of the access token
          // expiration date.
          accessTokenlifeTime = Math.floor(Math.abs(
            (new Date().getTime() -
              new Date(accessToken.exp * 1000).getTime()) /
              1000,
          ));

          // Calculate the new cookie lifetime based off of the access token
          // expiration date.
          const lifeTime = Math.round(Math.abs(
            (new Date().getTime() - tokenInfo.expiresOn.getTime()) /
              1000,
          ));

          // calculate the expiration date of the refresh token httpOnly Cookie
          const refreshExpd = new Date();
          refreshExpd.setTime(refreshExpd.getTime() + lifeTime * 1000);

          await setCookieInfo(cookies, tokenInfo.token, refreshExpd);

          const responseTokens: Record<string, string | undefined> = {};
          responseTokens[JWT_ACCESS_TOKEN_NAME] = tokenInfo.associatedToken;
          responseTokens[JWT_REFRESH_TOKEN_NAME] = tokenInfo.token;

          const user: UserSchema = await UserService.getUserById(
            tokenInfo.userId,
          ) as UserSchema;

          if (user) {
            const loginResponse: LoginUserResponse = {
              ...responseTokens,
              jti: resultId,
              tokenType: AUTH_TOKEN_TYPE,
              expiresIn: accessTokenlifeTime,
              user: createResponseUser(user),
            };

            response.body = {
              code: "success",
              status: 200,
              message: "success",
              details: loginResponse,
            };
            return;
          } else {
            log.debug(
              `user id associated with token was not found: ${tokenInfo.userId} `,
            );
          }
        } else {
          log.debug(
            `Access token associated with request is invalid or expired: ${resultId} `,
          );
        }
      }
      log.debug(`Logging out and deleting cookie: ${JWT_COOKIE_NAME} `);
      cookies.delete(JWT_COOKIE_NAME);
      throw new httpErrors.BadRequest(
        "Token result request is invalid or expired.",
      );
    }
  },
];
