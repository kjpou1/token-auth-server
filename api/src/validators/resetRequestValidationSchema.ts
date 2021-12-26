import { validasaur } from "../utils/deps.ts";

/** request body schema for password forgot */
export const resetRequestValidationSchema = {
  email: [validasaur.required, validasaur.isEmail],
};
