import { Repository } from "./repository.ts";
import { Collection } from "../utils/deps.ts";
import { TokenSchema } from "../schemas/schemas.ts";

export class TokenRepository extends Repository {
  private static collection: Collection<TokenSchema>;
  get collectionName(): string {
    return "tokens";
  }
  repositoryCollection(): Collection<TokenSchema> {
    if (!TokenRepository.collection) {
      TokenRepository.collection = this.dataBase.getDatabase.collection<
        TokenSchema
      >(
        this.collectionName,
      );
    }
    return TokenRepository.collection;
  }
}
