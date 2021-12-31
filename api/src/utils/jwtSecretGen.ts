import { log } from "./deps.ts";
export async function jwtSecretGen() {
  log.info("===============================");
  log.info("* Generating secret key ...   *");
  log.info("===============================");
  const key = await crypto.subtle.generateKey(
    {
      name: "HMAC",
      hash: { name: "SHA-512" },
    },
    true,
    ["sign", "verify"],
  );
  const jasonWebKey = await crypto.subtle.exportKey("jwk", key);
  if (jasonWebKey.k) {
    await Deno.writeTextFile("./id_hmac_pub.key", jasonWebKey.k);
    log.info("===============================");
    log.info("* Keyfile was generated       *");
    log.info("===============================");
    Deno.exit(0);
  }

  log.critical("===============================");
  log.critical("* Error generating keyfile    *");
  log.critical("===============================");
  Deno.exit(-1);
}
