import crypto from 'crypto';
import * as config from './config';

const algorithm = 'aes-256-ctr';
const ivLength = 16;
const password = config.TOKEN_ENCRYPTION_FRASE;

// http://vancelucas.com/blog/stronger-encryption-and-decryption-in-node-js/
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(password), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
  try {
    const textParts = text.split(':');
    const first = textParts.shift();
    if(!first) {
      return text;
    }

    const iv = Buffer.from(first, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(password),
      iv
    );
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString();
  } catch (err) {
    return text;
  }
}
