import { validasaur } from "../../utils/deps.ts";

export function minNumber(minValue: number): validasaur.Rule {
  return function minNumberValidity(value: any): validasaur.Validity {
    if (typeof value !== "string" && typeof value !== "number") {
      return validasaur.invalid("isNumeric", { value });
    }

    if (typeof value === "string" && !(value as string).match(/\d+(\.\d+)?/)) {
      return validasaur.invalid("isNumeric", { value });
    }
    value = Number(value);
    if (typeof value !== "number" || value < minValue) {
      return validasaur.invalid("minNumber", { value, minValue });
    }
  };
}
