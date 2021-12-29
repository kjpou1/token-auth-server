export async function jwtSecretGen() {
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
    console.log("Keyfile was generated");
    return;
  }

  throw new Error("Keyfile was not generated.");
}
