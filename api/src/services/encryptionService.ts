import { bcrypt, djwt, log } from "../utils/deps.ts";
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

  private static pubKeyFileVerified: boolean;
  private static pubKeyBytes: Uint8Array = new Uint8Array();

  private static getPublicKeyEncoder(): Uint8Array {
    if (!this.pubKeyFileVerified) {
      this.pubKeyFileVerified = true;
      const statInfo = Deno.statSync(JWT_SECRET_FILE);
      if (statInfo.isFile) {
        const secretSauce = Deno.readTextFileSync(JWT_SECRET_FILE);
        this.pubKeyBytes = new TextEncoder().encode(secretSauce);
      }
    }

    if (this.pubKeyBytes.byteLength === 0) {
      throw new Error(
        "Internal Server Error: Crypto Key file not found.  Please generate a file and retry.",
      );
    }
    return this.pubKeyBytes;
  }

  static get keyHS512() {
    return crypto.subtle.importKey(
      "raw",
      this.getPublicKeyEncoder(),
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["sign", "verify"],
    ) as Promise<CryptoKey>;
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
