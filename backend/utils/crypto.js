// utils/crypto.js
import crypto from "crypto";

const AES_SECRET = process.env.AES_KEY
const HMAC_SECRET = process.env.HMAC_KEY;

// if (!AES_SECRET || !HMAC_SECRET) {
//   throw new Error("❌ AES_KEY or HMAC_KEY missing in environment variables");
// }

const AES_KEY = Buffer.from(AES_SECRET, "hex");
const HMAC_KEY = Buffer.from(HMAC_SECRET, "hex");

export function encryptPayload(data) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", AES_KEY, iv);

  let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
  encrypted += cipher.final("hex");

  const hmac = crypto
    .createHmac("sha256", HMAC_KEY)
    .update(encrypted)
    .digest("hex");

  return {
    iv: iv.toString("hex"),
    encrypted,
    hmac
  };
}

export function verifyHmac(encrypted, receivedHmac) {
  const computed = crypto
    .createHmac("sha256", HMAC_KEY)
    .update(encrypted)
    .digest("hex");

  return computed === receivedHmac;
}

console.log("AES_KEY loaded:", !!process.env.AES_KEY);
console.log("HMAC_KEY loaded:", !!process.env.HMAC_KEY);
