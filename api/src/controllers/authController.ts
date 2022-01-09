import { config } from "../config/config.ts";
import { authorize, requestValidator } from "../middlewares/middlewares.ts";
import { UserSchema } from "../schemas/schemas.ts";
import {
  EncryptionService,
  TokenRequestService,
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
  cleanUpRefreshToken,
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

  if (tokens.jti) {
    TokenRequestService.persistTokenRequestInformation(
      tokens.jti,
      JSON.stringify(loginResponse),
    );
  }

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
  async (
    { response, cookies, state }: RouterContext<"logout">,
  ) => {
    log.debug(`Logging out and deleting cookie: ${JWT_COOKIE_NAME} `);
    cleanUpRefreshToken(cookies, state.refreshToken as RefreshToken);
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
        await TokenService.expireCurrentToken(refreshToken.jti);
        await TokenRequestService.removeTokenRequestInformation(
          refreshToken.jti,
        );
        await setAuthResponse(response, cookies, user, refreshToken);
      }
    } else {
      log.debug(`Logging out and deleting cookie: ${JWT_COOKIE_NAME} `);
      cleanUpRefreshToken(cookies, refreshToken);
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
    const { response, cookies, state } = ctx;

    /** get token request id from params */
    const { resultId } = helpers.getQuery(ctx, { mergeParams: true });
    if (resultId) {
      const requestEntry = await TokenRequestService
        .retrieveTokenRequestInformation(
          resultId,
        );

      if (requestEntry) {
        const requestInfo = JSON.parse(requestEntry) as LoginUserResponse;
        const refreshTokenInfo = requestInfo[JWT_REFRESH_TOKEN_NAME] as string;
        const requestTokenInfo = await TokenService.getJwtPayload(
          refreshTokenInfo,
        );

        if (requestTokenInfo?.exp) {
          let accessTokenlifeTime = 0;

          const accessToken = await TokenService.getJwtPayload(
            requestInfo[JWT_ACCESS_TOKEN_NAME] as string,
          );

          if (accessToken?.exp) {
            // Calculate the remaining lifetime based off of the access token
            // expiration date.
            accessTokenlifeTime = Math.floor(Math.abs(
              (new Date().getTime() -
                new Date(accessToken.exp * 1000).getTime()) /
                1000,
            ));

            requestInfo.expiresIn = accessTokenlifeTime;

            // Calculate the cookie expire date based off of the refresh token
            // expiration date.
            const requestInfoExpiresOn = new Date(requestTokenInfo.exp);
            requestInfoExpiresOn.setTime(requestInfoExpiresOn.getTime() * 1000);

            await setCookieInfo(
              cookies,
              refreshTokenInfo,
              requestInfoExpiresOn,
            );

            response.body = {
              code: "success",
              status: 200,
              message: "success",
              details: requestInfo,
            };
            return;
          } else {
            log.debug(
              `Access token associated with request is invalid or expired: ${resultId} `,
            );
          }
        }
      } else {
        log.debug(`Could not find request for token id: ${resultId} `);
      }
      log.debug(`Logging out and deleting cookie: ${JWT_COOKIE_NAME} `);
      cleanUpRefreshToken(cookies, state.refreshToken as RefreshToken);
      throw new httpErrors.BadRequest(
        "Token result request is invalid or expired.",
      );
    }
  },
];
