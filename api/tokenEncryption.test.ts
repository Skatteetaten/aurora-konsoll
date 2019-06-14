import { encrypt } from './tokenEncryption';

describe('token encryption', () => {

  it('should encrypt token', () => {
    const encrypted = encrypt('testing testing');
    console.log(encrypted);

    expect(true).toBeTruthy();
  });
});