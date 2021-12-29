import { bcrypt } from "../utils/deps.ts";
import { config } from "../config/config.ts";
const { JWT_SECRET_FILE } = config;

export class EncryptionService {
  /**
   * encript given string
   */
  static async encrypt(password: string) {
    return await bcrypt.hash(password);
  }

  /**
   * compare given password and hash
   */
  static async compare(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  static get keyHS512() {
    return keyHS512;
  }

  /**
   * Generate cryptographically random strings
   * https://github.com/often/cstring
   * @param {Number} length - The length of the string.
   */
  static GenerateRandomString(length: number) {
    if (!length) throw "missing string length";

    if (!Number.isInteger(length)) throw "string length must be an integer";

    let string = "";
    const values = crypto.getRandomValues(new Uint8Array(length));

    for (; length--;) {
      const _ = 63 & values[length];

      string += _ < 36
        ? _.toString(36)
        : _ < 62
        ? (_ - 26).toString(36).toUpperCase()
        : _ < 63
        ? "_"
        : "-";
    }

    return string;
  }
}

const keyHS512 = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(await Deno.readTextFile(JWT_SECRET_FILE)),
  { name: "HMAC", hash: "SHA-512" },
  false,
  ["sign", "verify"],
);
