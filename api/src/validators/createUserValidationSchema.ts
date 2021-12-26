import { validasaur } from "../utils/deps.ts";
import { validRolesRule } from "./rules/userRolesValidator.ts";
import { validPasswordRule } from "./rules/passwordValidator.ts";

/** request body schema for user create/update */
export const createUserValidationSchema = {
  name: [validasaur.required],
  email: [validasaur.required, validasaur.isEmail],
  password: [
    validasaur.required,
    validPasswordRule,
  ],
  roles: [validasaur.required, validRolesRule],
};
