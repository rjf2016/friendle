import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const ALGO = 'aes-256-gcm';

const KEY = (() => {
  const raw = process.env.GAME_SECRET_KEY;
  if (!raw) {
    throw new Error('GAME_SECRET_KEY env var is not set');
  }
  const buf = Buffer.from(raw, 'base64');
  if (buf.length !== 32) {
    throw new Error('GAME_SECRET_KEY must be 32 bytes base64-encoded');
  }
  return buf;
})();

/**
 * Create an opaque, URL-safe token that encodes the secret word.
 * Word must be uppercase and exactly 5 letters.
 */
export function createGameToken(word: string): string {
  const normalized = word.toUpperCase();
  if (!/^[A-Z]{5}$/.test(normalized)) {
    throw new Error('Secret word must be 5 uppercase letters');
  }

  const plaintext = Buffer.from(normalized, 'utf8');
  const iv = randomBytes(12);

  const cipher = createCipheriv(ALGO, KEY, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // [iv][authTag][ciphertext]
  const tokenBuffer = Buffer.concat([iv, authTag, ciphertext]);

  return tokenBuffer.toString('base64url');
}

/**
 * Decrypt a token back into its secret word.
 * Throws if token is invalid or tampered with.
 */
export function decryptGameToken(token: string): string {
  try {
    const data = Buffer.from(token, 'base64url');

    const iv = data.subarray(0, 12);
    const authTag = data.subarray(12, 28);
    const ciphertext = data.subarray(28);

    const decipher = createDecipheriv(ALGO, KEY, iv);
    decipher.setAuthTag(authTag);

    const plaintext = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);
    const word = plaintext.toString('utf8');

    if (!/^[A-Z]{5}$/.test(word)) {
      throw new Error('Invalid word in token');
    }

    return word;
  } catch {
    throw new Error('Invalid game token');
  }
}
