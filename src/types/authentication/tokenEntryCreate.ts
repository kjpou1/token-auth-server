import { Bson } from "../../utils/deps.ts";
import { TokenType } from "./tokenTypes.ts";

// Defining schema interface
export type TokenEntryCreate = {
  token: string;
  userId: Bson.ObjectId;
  type: TokenType;
  expiresOn?: Date; // expiry date
  lastUsedOn?: Date;
  createdOn?: Date;
  modifiedOn?: Date;
};
