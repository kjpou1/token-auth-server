import {
  checkPasswordWithResult,
  httpErrors,
  validasaur,
} from "../../utils/deps.ts";

/**
 * Validate the roles values
 */
export function validPasswordRule(
  passwordString: string,
): validasaur.Validity {
  // To run a check against 10k common passwords
  const verificationResult = checkPasswordWithResult({
    password: passwordString,
    minLen: 3,
    // containsAlphabet: true,
    // containsNum: true,
    // containsSpecialChar: true,
    checkWithCommonPasswords: true,
  });

  if (!verificationResult.isValid) {
    throw new httpErrors.BadRequest(verificationResult.reason);
  }

  if (!verificationResult.isValid) {
    // short circuit above for now as need to figure out
    // how to pass custom message from here
    return validasaur.invalid(verificationResult.reason ?? "password", {
      passwordString,
    });
  }
}
