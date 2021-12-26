import { Bson } from "../../utils/deps.ts";

// Defining schema interface
export type Reset = {
  _id: Bson.ObjectId;
  email: string;
  token: string;
  expiresOn?: Date; // expiry date
  createdOn?: Date;
  modifiedOn?: Date;
};
