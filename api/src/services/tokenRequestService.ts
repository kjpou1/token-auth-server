/**
 * This service is an interface-ish to work with token request informaiton
 *
 * Right now it is based on using Redis but could be changed to used a database if
 * one wanted to without changing the calling modules.
 */

import { RedisService } from "./services.ts";

export class TokenRequestService {
  static async persistTokenRequestInformation(
    id: string,
    requestInformation: string,
  ) {
    await RedisService.persistTokenRequestInformation(id, requestInformation);
  }

  static async retrieveTokenRequestInformation(
    id: string,
  ): Promise<string> {
    return await RedisService.retrieveTokenRequestInformation(id);
  }

  static async removeTokenRequestInformation(
    id: string,
  ): Promise<number> {
    if (id) {
      return await RedisService.removeTokenRequestInformation(id);
    }
    return -1;
  }
}
