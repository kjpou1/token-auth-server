import { config } from "../config/config.ts";
import { Redis, redisConnect } from "../utils/deps.ts";

export class RedisService {
  private static instance: RedisService;
  redisClient: Redis = {} as Redis;

  private constructor() {
    // do something construct...
  }
  static async getInstance() {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
      // ... any one time initialization goes here ...
      const { hostname, port } = new URL(config.REDIS_URI);
      RedisService.instance.redisClient = await redisConnect({
        hostname,
        port,
      });
    }
    return RedisService.instance;
  }

  get RedisClient() {
    return this.redisClient;
  }

  /**
   * Persist the information corresponding to the id as the key
   * @param id The key for the value to be set
   * @param requestInformation The value to be set for the id
   */
  static async persistTokenRequestInformation(
    id: string,
    requestInformation: string,
  ) {
    await (await this.getInstance()).RedisClient.set(id, requestInformation);
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
    return await (await this.getInstance()).RedisClient.get(id) as string;
  }

  /**
   * Remove the entry corresponding to the id
   * @param id The key to be removed
   * @returns Count
   */
  static async removeTokenRequestInformation(
    id: string,
  ): Promise<number> {
    return await (await this.getInstance()).RedisClient.del(id);
  }
}
