import CryptoJS from 'crypto-js';

// Encrypt data
export const encryptData = (data, secret) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();
};

// Decrypt data
export const decryptData = (cipherText, secret) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secret);
  try {
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch {
    return null;
  }
};
