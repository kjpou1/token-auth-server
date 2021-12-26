import { minNumber } from "./rules/minNumberRule.ts";

/** pagination request parameters */
export const paginationValidationSchema = {
  limit: [minNumber(0)],
  offset: [minNumber(0)],
};
