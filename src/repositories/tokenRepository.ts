import { Repository } from "./repository.ts";
import { Collection } from "../utils/deps.ts";
import { UserSchema } from "../schemas/schemas.ts";

export class TokenRepository extends Repository {
  get collectionName(): string {
    return "tokens";
  }
  repositoryCollection(): Collection<UserSchema> {
    const db = this.dataBase;
    if (db === undefined) {
      throw new Error("Problem initializing database");
    }
    return db.collection<UserSchema>(this.collectionName);
  }
}
