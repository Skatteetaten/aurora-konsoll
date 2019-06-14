import { encrypt, decrypt } from './tokenEncryption';

describe('token encryption', () => {

  it('should encrypt and decrypt token', () => {
    const original = 'testing 123';
    const encrypted = encrypt(original);
    const decrypted = decrypt(encrypted);

    expect(encrypted.length > 0).toBeTruthy();
    expect(decrypted).toEqual(original);
  });


});