import { Bson } from "../../utils/deps.ts";

// Defining schema interface
export type User = {
  _id: Bson.ObjectId;
  name: string;
  email: string;
  emailVerified: boolean;
  password: string;
  active: boolean;
  createdOn: Date;
  modifiedOn?: Date;
  blockedOn?: Date;
};
