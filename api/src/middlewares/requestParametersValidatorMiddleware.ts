import {
  Context,
  helpers,
  httpErrors,
  RouterMiddleware,
  validasaur,
} from "../utils/deps.ts";

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

/** Validatior middleware */
export const requestParametersValidator = (
  { parameterRules }: { parameterRules?: validasaur.ValidationRules },
) => {
  const core: RouterMiddleware<""> = async (ctx: Context, next) => {
    const queryParameters = helpers.getQuery(ctx, {
      mergeParams: true,
    });
    /** check rules */
    const [isValid, errors] = await validasaur.validate(
      { ...queryParameters },
      parameterRules ?? {},
    );
    if (!isValid) {
      /** if error found, throw bad request error */
      const message = getErrorMessage(errors);
      throw new httpErrors.BadRequest(message);
    }

    await next();
  };

  return core;
};
