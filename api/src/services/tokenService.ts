import { config } from "../config/config.ts";
import { TokenRepository } from "../repositories/repositories.ts";
import { EncryptionService, UserService } from "../services/services.ts";
import {
  AccessToken,
  CreateTokens,
  RefreshToken,
  Token,
  TokenEntryCreate,
  TokenType,
} from "../types/authentication/tokenTypes.ts";
import { UserRole } from "../types/user/userTypes.ts";
import { Bson, djwt, httpErrors, log } from "../utils/deps.ts";

const {
  JWT_ACCESS_TOKEN_EXP,
  JWT_CLAIM_ISSUER,
  JWT_CLAIM_AUDIENCE,
  JWT_REFRESH_TOKEN_EXP,
} = config;

// tokens definition
const repository = new TokenRepository();

export class TokenService {
  static async getJwtPayload(token: string): Promise<djwt.Payload | null> {
    try {
      const payload = await djwt.verify(
        token,
        await EncryptionService.keyHS512,
      );
      return payload;
    } catch (err) {
      log.debug(err);
    }
    return null;
  }

  static async createAccessToken(
    subject: Record<string, string | Bson.ObjectId | [UserRole]>,
  ): Promise<string> {
    // Numeric date
    const numericDate = djwt.getNumericDate(new Date());

    const payload: AccessToken = {
      iss: JWT_CLAIM_ISSUER,
      sub: JSON.stringify(subject),
      aud: JWT_CLAIM_AUDIENCE,
      exp: this.createExpirationDate(Number(JWT_ACCESS_TOKEN_EXP)),
      nbf: numericDate,
      iat: numericDate,
      jti: crypto.randomUUID(),
    };
    const accessToken = await djwt.create(
      { alg: "HS512", typ: "JWT" },
      payload,
      await EncryptionService.keyHS512,
    );
    const expd = new Date(payload.exp);
    expd.setTime(expd.getTime() * 1000);

    const tokenEntity = {
      jti: payload.jti,
      token: accessToken,
      userId: subject._id,
      type: TokenType.ACCESS,
      expiresOn: expd,
      createdOn: new Date(),
    } as TokenEntryCreate;
    const entity = await repository.create(tokenEntity);
    return accessToken;
  }

  static createExpirationDate(exp: number): number {
    // const expd = new Date();
    // expd.setTime(expd.getTime() + exp);
    return djwt.getNumericDate(exp);
  }

  /**
   * Creates a refresh token and creates a record in the Tokens repository
   * @param subject - the claims subject to be included with the JWT token
   * @returns the token as a string
   */
  static async createRefreshToken(
    subject: Record<string, string | Bson.ObjectId | [UserRole]>,
    accessToken: string,
  ): Promise<Record<string, string>> {
    const refreshPayload: RefreshToken = {
      sub: JSON.stringify(subject),
      exp: this.createExpirationDate(Number(JWT_REFRESH_TOKEN_EXP)),
      jti: crypto.randomUUID(),
    };
    const refreshToken = await djwt.create(
      { alg: "HS512", typ: "JWT" },
      refreshPayload,
      await EncryptionService.keyHS512,
    );
    const expd = new Date();
    expd.setTime(expd.getTime() + Number(JWT_REFRESH_TOKEN_EXP) * 1000);

    const tokenEntity = {
      jti: refreshPayload.jti,
      token: refreshToken,
      associatedToken: accessToken,
      userId: subject._id,
      type: TokenType.REFRESH,
      expiresOn: expd,
      createdOn: new Date(),
    } as TokenEntryCreate;
    await repository.create(tokenEntity);
    return { refreshToken, jti: tokenEntity.jti };
  }

  static async rotateRefreshToken(
    subject: Record<string, string | Bson.ObjectId | [UserRole]>,
    lifeTime: number,
    accessToken: string,
  ): Promise<Record<string, string>> {
    const refreshPayload: RefreshToken = {
      sub: JSON.stringify(subject),
      exp: this.createExpirationDate(lifeTime),
      jti: crypto.randomUUID(),
    };
    const refreshToken = await djwt.create(
      { alg: "HS512", typ: "JWT" },
      refreshPayload,
      await EncryptionService.keyHS512,
    );

    log.debug("Rotating refresh token");
    const expd = new Date();
    expd.setTime(expd.getTime() + lifeTime * 1000);

    const tokenEntity = {
      jti: refreshPayload.jti,
      token: refreshToken,
      associatedToken: accessToken,
      userId: subject._id,
      type: TokenType.REFRESH,
      expiresOn: expd,
      createdOn: new Date(),
    } as TokenEntryCreate;
    const entity = await repository.create(tokenEntity);
    return { refreshToken, jti: tokenEntity.jti };
  }

  static async createTokens(
    subject: Record<string, string | Bson.ObjectId | [UserRole]>,
  ): Promise<CreateTokens> {
    const { _id } = subject;
    const query = { userId: _id };

    // Expire all existing refresh tokens for this customer.
    const expd = new Date();
    expd.setTime(expd.getTime() - 1000);
    const updData = {
      expiresOn: expd,
      lastUsedOn: expd,
      updatedOn: new Date(),
    };

    // This routine returns back the number of matches and the number of updates
    await repository.updateAll(query, updData);

    const createdTokens: CreateTokens = {} as CreateTokens;
    createdTokens.accessToken = await this.createAccessToken(subject);

    const refreshTokenInfo = await this.createRefreshToken(
      subject,
      createdTokens.accessToken,
    );
    createdTokens.refreshToken = refreshTokenInfo.refreshToken;
    createdTokens.jti = refreshTokenInfo.jti;
    return createdTokens;
  }

  static async createRotatedTokens(
    subject: Record<string, string | Bson.ObjectId | [UserRole]>,
    refreshToken: RefreshToken,
  ): Promise<CreateTokens> {
    const lifeTime = Math.round(Math.abs(
      (new Date().getTime() - new Date(refreshToken.exp * 1000).getTime()) /
        1000,
    ));
    const createdTokens: CreateTokens = {} as CreateTokens;
    createdTokens.accessToken = await this.createAccessToken(subject);

    const refreshTokenInfo = await this.rotateRefreshToken(
      subject,
      lifeTime,
      createdTokens.accessToken,
    );
    createdTokens.refreshToken = refreshTokenInfo.refreshToken;
    createdTokens.jti = refreshTokenInfo.jti;

    return createdTokens;
  }

  static async expireCurrentToken(
    jti: string,
  ): Promise<void> {
    const currentToken = await repository.findBy({ jti });
    if (currentToken) {
      const { _id } = currentToken;
      // we now update our token to specify that it has already been used before
      // Expire current access token.
      const expd = new Date();
      expd.setTime(expd.getTime() - 1000);
      const updData = {
        expiresOn: expd,
        lastUsedOn: new Date(),
        updatedOn: new Date(),
      };

      await repository.update(_id, updData);
    }
  }

  static async validateRotationToken(
    refreshToken: RefreshToken,
  ): Promise<boolean> {
    const query = { jti: refreshToken.jti, type: TokenType.REFRESH };
    const token = await repository.findBy(query) as Token;
    if (!token) {
      throw new httpErrors.Forbidden("Invalid refresh token.");
    }

    if (token.lastUsedOn) {
      // This token has been used before.
      // We'll block the user's access to the API by marking this refresh token as compromised.
      // Human interaction is required to lift this limit, something like deleting the compromised tokens.
      const { _id } = token;
      const updData = {
        compromisedOn: new Date(),
        updatedOn: new Date(),
      };

      // This routine returns back the update record
      const compromisedToken = await repository.update(_id, updData);
      log.debug("Refresh Token has been compromized");
      log.debug("Blocking user");
      const isUserBlocked = await UserService.blockUser(token.userId);
      if (!isUserBlocked) {
        log.warning(`User ${token.userId} was not blocked.`);
      }
      throw new httpErrors.Forbidden("Invalid refresh token.");
    }
    if (token.expiresOn && token.expiresOn?.getTime() < Date.now()) {
      log.debug("Refresh Token is expired");
      throw new httpErrors.Forbidden("Invalid refresh token.");
    }

    // we now update our token to specify that it has already been used before
    // Expire all existing refresh tokens for this customer.
    const { _id } = token;
    const expd = new Date();
    expd.setTime(expd.getTime() - 1000);
    const updData = {
      expiresOn: expd,
      lastUsedOn: new Date(),
      updatedOn: new Date(),
    };

    // This routine returns back the update record
    const updd = await repository.update(_id, updData);
    if (!updd) {
      throw new httpErrors.Unauthorized("Error updating token information");
    }
    return true;
  }

  static async getTokenResult(
    resultId: string,
  ): Promise<Token | null> {
    const resultToken = await repository.findBy({ jti: resultId });
    return resultToken;
  }

  static async clearAll(): Promise<boolean> {
    await repository.drop();
    return true;
  }
}
