import { TokenSchema } from "../schemas/schemas.ts";
import { Collection } from "../utils/deps.ts";
import { Repository } from "./repository.ts";

export class TokenRepository extends Repository {
  private static collection: Collection<TokenSchema>;
  get collectionName(): string {
    return "tokens";
  }
  async repositoryCollection(): Promise<
    Collection<TokenSchema>
  > {
    if (!TokenRepository.collection) {
      await this.dataBase.connect();
      TokenRepository.collection = this.dataBase.getDatabase.collection<
        TokenSchema
      >(
        this.collectionName,
      );
    }
    return TokenRepository.collection;
  }
}
