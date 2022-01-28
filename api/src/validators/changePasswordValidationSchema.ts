import { validasaur } from "../utils/deps.ts";
import { validPasswordRule } from "./rules/passwordValidator.ts";

/** request body schema for password forgot */
export const changePasswordValidationSchema = {
  passwordCurrent: [validasaur.required],
  passwordNew: [validasaur.required, validPasswordRule],
  passwordConfirm: [validasaur.required, validPasswordRule],
};
