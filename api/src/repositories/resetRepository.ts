import { ResetSchema } from "../schemas/schemas.ts";
import { Collection } from "../utils/deps.ts";
import { Repository } from "./repository.ts";

export class ResetRepository extends Repository {
  private static collection: Collection<ResetSchema>;
  get collectionName(): string {
    return "password_reset";
  }
  async repositoryCollection(): Promise<Collection<ResetSchema>> {
    if (!ResetRepository.collection) {
      await this.dataBase.connect();
      ResetRepository.collection = this.dataBase.getDatabase.collection<
        ResetSchema
      >(
        this.collectionName,
      );
    }
    return ResetRepository.collection;
  }
}
