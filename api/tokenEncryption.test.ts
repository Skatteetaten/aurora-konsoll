import { encrypt, decrypt } from './tokenEncryption';

describe('token encryption', () => {
  const original = 'testing 123';

  it('should encrypt and decrypt token', () => {
    const encrypted = encrypt(original);
    const decrypted = decrypt(encrypted);

    expect(encrypted.length).toBeGreaterThan(0);
    expect(decrypted).toEqual(original);
  });

  it('should encrypt same text to different tokens', () => {
    const encrypted1 = encrypt(original);
    const encrypted2 = encrypt(original);

    expect(encrypted1.length).toBeGreaterThan(0);
    expect(encrypted2.length).toBeGreaterThan(0);
    expect(encrypted1).not.toEqual(encrypted2);
  });

  it('should return input text if decrypt fails', () => {
    const textWithIv = '123:456';
    const decrypted = decrypt(textWithIv);

    expect(decrypted).toEqual(textWithIv);
  });

  it('should return input text if initialization vector is missing', () => {
    const textWithoutIv = '123';
    const decrypted = decrypt(textWithoutIv);

    expect(decrypted).toEqual(textWithoutIv);
  });

});