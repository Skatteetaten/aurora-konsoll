import crypto from 'crypto';
import { TOKEN_ENCRYPTION_FRASE } from './config';

const algorithm = 'aes-256-ctr';
const password = TOKEN_ENCRYPTION_FRASE;

export function encrypt(text: string): string {
  const cipher = crypto.createCipher(algorithm, password);
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

export function decrypt(text: string): string {
  try {
    const decipher = crypto.createDecipher(algorithm, password);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  } catch (err) {
    return text;
  }
}
