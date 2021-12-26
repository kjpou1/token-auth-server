import { Repository } from "./repository.ts";
import { Collection } from "../utils/deps.ts";
import { ResetSchema } from "../schemas/schemas.ts";

export class ResetRepository extends Repository {
  private static collection: Collection<ResetSchema>;
  get collectionName(): string {
    return "password_reset";
  }
  repositoryCollection(): Collection<ResetSchema> {
    if (!ResetRepository.collection) {
      ResetRepository.collection = this.dataBase.getDatabase.collection<
        ResetSchema
      >(
        this.collectionName,
      );
    }
    return ResetRepository.collection;
  }
}
