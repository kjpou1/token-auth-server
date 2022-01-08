import { config } from "../config/config.ts";
import { redisConnect } from "../utils/deps.ts";
const { REDIS_URI } = config;

// setup Redis:
const { hostname, port } = new URL(REDIS_URI);
const redisClient = await redisConnect({ hostname, port });

export class RedisService {
  static async persistTokenRequestInformation(
    id: string,
    requestInformation: string,
  ) {
    await redisClient.set(id, requestInformation);
  }

  static async retrieveTokenRequestInformation(
    id: string,
  ): Promise<string> {
    return await redisClient.get(id) as string;
  }
}
