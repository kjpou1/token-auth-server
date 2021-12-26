import { Bson } from "../../utils/deps.ts";
import { UserRole } from "./roles.ts";

/** Type used in response */
export type ResponseUser = {
  _id: Bson.ObjectId;
  /** user name */
  name: string;
  /** user email */
  email: string;
  /** roles */
  roles: [UserRole];
};
