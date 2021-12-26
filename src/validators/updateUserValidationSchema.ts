import { validasaur } from "../utils/deps.ts";
import { validRolesRule } from "./rules/userRolesValidator.ts";

/** request body schema for user create/update */
export const updateUserValidationSchema = {
  name: [validasaur.required],
  email: [validasaur.required, validasaur.isEmail],
  roles: [validasaur.required, validRolesRule],
};
