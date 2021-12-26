import { Repository } from "./repository.ts";
import { Collection } from "../utils/deps.ts";
import { ResetSchema } from "../schemas/schemas.ts";

export class ResetRepository extends Repository {
  get collectionName(): string {
    return "password_reset";
  }

  repositoryCollection(): Collection<ResetSchema> {
    const db = this.dataBase;
    if (db === undefined) {
      throw new Error("Problem initializing database");
    }
    return db.collection<ResetSchema>(this.collectionName);
  }
}
