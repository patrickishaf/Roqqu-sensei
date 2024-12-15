import { createCipheriv, createDecipheriv, CipherKey } from "node:crypto";
import config from '../config';

function _generateRandomIV() {
  let code = '';
  let possible = '0123456789';

  for (let i = 0; i < 16; i += 1) {
    code += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return code;
}

export const encrypt = (str: string) => {
  let randomIV = _generateRandomIV();
  let iv = Buffer.from(randomIV);
  const data = Buffer.from(str);

  const cipher = createCipheriv('aes-256-ctr', config.encryptionKey as CipherKey, iv);
  let encrypted = Buffer.concat([cipher.update(data), cipher.final()]);

  let encryptedHex = encrypted.toString('hex');
  let ivHex = iv.toString('hex');

  return encryptedHex.slice(0, 10) + ivHex + encryptedHex.slice(10, encryptedHex.length);
}

function hexToUint8Array(hexString: string) {
  const length = hexString.length / 2;
  const byteArray = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    byteArray[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return byteArray;
}

export const decryptWithAES = async (key: string, encryptedText: string) => {
  try {
    const keyBytes = new TextEncoder().encode(
      key.padEnd(32, '0').substring(0, 32),
    );

    const parts = encryptedText.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }

    const encryptedDataHex = parts[0];
    const ivHex = parts[1];

    const iv = hexToUint8Array(ivHex);
    const encryptedBody = hexToUint8Array(encryptedDataHex);

    // Import the encryption key
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'AES-CTR' },
      false,
      ['decrypt'],
    );

    // Decrypt the data
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-CTR',
        counter: iv, // Counter is now correctly handled as Base16 hex
        length: 64, // Make sure this matches the counter length used during encryption
      },
      cryptoKey,
      encryptedBody,
    );

    // Convert decrypted data to string
    const decryptedText = new TextDecoder().decode(decryptedBuffer);
    return decryptedText;
  } catch (error) {
    console.error('Decryption failed: ', error);
    throw error;
  }
}