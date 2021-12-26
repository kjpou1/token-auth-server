import { Context, httpErrors, validasaur } from "../utils/deps.ts";

/**
 * get single error message from errors
 */
const getErrorMessage = (
  errors: validasaur.ValidationErrors,
): string | undefined => {
  for (let attr in errors) {
    const attrErrors = errors[attr];
    for (let rule in attrErrors) {
      return attrErrors[rule] as string;
    }
  }
};

/**
 * request validation middleware
 * validate request body with given validation rules
 */
export const requestValidator = (
  { bodyRules }: { bodyRules?: validasaur.ValidationRules },
) => {
  return async (ctx: Context, next: () => Promise<unknown>) => {
    /** get request body */
    const request = ctx.request;
    const body = await request.body().value;
    /** check rules */
    const [isValid, errors] = await validasaur.validate(
      { ...body },
      bodyRules ?? {},
    );
    if (!isValid) {
      /** if error found, throw bad request error */
      const message = getErrorMessage(errors);
      throw new httpErrors.BadRequest(message);
    }

    await next();
  };
};
