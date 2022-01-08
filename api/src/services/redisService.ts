import { config } from "../config/config.ts";
import { redisConnect } from "../utils/deps.ts";
const { REDIS_URI } = config;

// setup Redis:
const { hostname, port } = new URL(REDIS_URI);
const redisClient = await redisConnect({ hostname, port });

export class RedisService {
  /**
   * Persist the information corresponding to the id as the key
   * @param id The key for the value to be set
   * @param requestInformation The value to be set for the id
   */
  static async persistTokenRequestInformation(
    id: string,
    requestInformation: string,
  ) {
    await redisClient.set(id, requestInformation);
  }

  /**
   * Retrieve the value for the id
   * @param id The key to be retrieved
   * @returns The value corresponding to the key (id)
   */
  static async retrieveTokenRequestInformation(
    id: string,
  ): Promise<string> {
    //console.log(await redisClient.keys("*"));
    return await redisClient.get(id) as string;
  }

  /**
   * Remove the entry corresponding to the id
   * @param id The key to be removed
   * @returns Count
   */
  static async removeTokenRequestInformation(
    id: string,
  ): Promise<number> {
    return await redisClient.del(id);
  }
}
