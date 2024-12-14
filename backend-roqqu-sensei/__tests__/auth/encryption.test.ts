import { decryptWithAES } from "../../src/auth/encryption";
import config from "../../src/config";

describe('decryptWithAES', () => {
  it('decrypts a string successfully', async () => {
    const encryptedString = '0f1138d9bd57c06edc367c0afce8a02f7fe35eb28d3ecfdf945a33f2bc713b1bd2544ecabe379c36902d2541206df9258cf3c8346459aeeb3b25779bddd34a3307a970bc02e492a3915735a1fe:7aad57dc3a32f440a16a13a920d4055a';
    const decryptedUser = await decryptWithAES(config.encryptionKey, encryptedString);
    console.log('decrypted user', decryptedUser);
    expect(typeof decryptedUser).toBe('string');
  })
})