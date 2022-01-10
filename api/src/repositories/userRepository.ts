import { UserSchema } from "../schemas/schemas.ts";
import { Collection } from "../utils/deps.ts";
import { Repository } from "./repository.ts";

export class UserRepository extends Repository {
  private static collection: Collection<UserSchema>;
  get collectionName(): string {
    return "users";
  }
  async repositoryCollection(): Promise<Collection<UserSchema>> {
    if (!UserRepository.collection) {
      await this.dataBase.connect();
      UserRepository.collection = this.dataBase.getDatabase.collection<
        UserSchema
      >(
        this.collectionName,
      );
    }
    return UserRepository.collection;
  }
}
