import { ResetRepository } from "../repositories/repositories.ts";
import { ResetSchema } from "../schemas/schemas.ts";
import { ResetRequest } from "../types/reset/resetPasswordTypes.ts";
import { Bson } from "../utils/deps.ts";

const repository = new ResetRepository();

export class ResetService {
  /**
   * Create reset request
   */
  static async createResetRequest(
    resetRequest: ResetRequest,
  ): Promise<ResetSchema> {
    const { email } = resetRequest;
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const lastInsertId = await repository.create({
      email,
      token: crypto.randomUUID(),
      createdOn: today,
      expiresOn: tomorrow,
    });
    return await repository.find(lastInsertId);
  }

  /**
   * Retieve original reset request
   */
  static async getResetRequest(
    requestToken: string,
  ): Promise<ResetSchema> {
    const original = await repository.findBy({
      token: requestToken,
    }) as ResetSchema;
    return original;
  }
  /**
   * Remove original reset request
   */
  static async removeResetRequest(
    _id: Bson.ObjectId,
  ): Promise<number> {
    const deletedCount = await repository.delete(_id);
    return deletedCount;
  }
}
