import { User, UserRole } from "../types/user/userTypes.ts";

/** Request body to create user */
export type UserSchema = User & {
  /** user roles */
  roles: [UserRole];
};
