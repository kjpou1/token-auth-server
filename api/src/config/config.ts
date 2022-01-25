import { dotenv, log } from "../utils/deps.ts";
export const config = loadConfig();

export function loadConfig(
  env = "development",
): Record<string, string> {
  // save off original env variables for later merge
  const originalEnv = Deno.env.toObject();

  // Check if there is an override
  env = Deno.env.get("DENO_ENV") ?? env;
  const safe = env !== "CI"; // Is this being executed from CI

  const configOptions = {
    path: `.env.${env}`,
    export: true,
    safe,
    example: `.env.example`,
    allowEmptyValues: false,
    defaults: `.env.defaults`,
  };

  log.info(
    `Loading config file for: ${env}.`,
  );
  try {
    const fileInfo = Deno.statSync(configOptions.path);
    if (!fileInfo.isFile) {
      log.warning(
        `Config file for: ${env} was not found.  Defaulting to .env`,
      );
      configOptions.path = ".env";
    }
  } catch {
    log.warning(
      `Config file for: ${env} was not found.  Defaulting to .env`,
    );
    configOptions.path = ".env";
  }

  const envConfig = dotenv.config(configOptions);

  // We will then go back through and override the environment variables
  // passed in so they will be accessible through our config object
  for (const key in originalEnv) {
    if (key in envConfig) {
      log.debug(
        `merging config ${key} with value from environment variable of the same name.`,
      );
      envConfig[key] = originalEnv[key];
    }
  }

  return envConfig;
}
