import { Repository } from "./repository.ts";
import { Collection } from "../utils/deps.ts";
import { UserSchema } from "../schemas/schemas.ts";

export class UserRepository extends Repository {
  private static collection: Collection<UserSchema>;
  get collectionName(): string {
    return "users";
  }
  repositoryCollection(): Collection<UserSchema> {
    if (!UserRepository.collection) {
      UserRepository.collection = this.dataBase.getDatabase.collection<
        UserSchema
      >(
        this.collectionName,
      );
    }
    return UserRepository.collection;
  }
}
