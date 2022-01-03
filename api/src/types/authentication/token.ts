import { Bson } from "../../utils/deps.ts";
import { TokenType } from "./tokenTypes.ts";

// Defining schema interface
export type Token = {
  _id: Bson.ObjectId;
  jti: string;
  token: string;
  associatedToken?: string;
  userId: Bson.ObjectId;
  type: TokenType;
  expiresOn?: Date; // expiry date
  compromisedOn?: Date;
  lastUsedOn?: Date;
  createdOn?: Date;
  modifiedOn?: Date;
};
