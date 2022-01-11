import { dotenv, log } from "../utils/deps.ts";
export const config = loadConfig();

export function loadConfig(
  env = "development",
): Record<string, string> {
  // Check if there is an override
  env = Deno.env.get("DENO_ENV") ?? env;
  const configOptions = {
    path: `.env.${env}`,
    export: true,
    safe: true,
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
  return envConfig;
}
