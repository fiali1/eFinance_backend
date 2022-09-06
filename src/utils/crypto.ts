import { config } from 'dotenv';
import crypto from 'crypto';

config();

type HashObject = {
  iv: string;
  content: string;
};

const { CRYPTO_SECRET_KEY: secretKey } = process.env;
const algorithm = 'aes-256-ctr';

const encrypt = (content: string) => {
  if (!secretKey) {
    return null;
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(content), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
};

const decrypt = (hash: HashObject) => {
  if (!secretKey) {
    return null;
  }

  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(hash.iv, 'hex')
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, 'hex')),
    decipher.final(),
  ]);

  return decrpyted.toString();
};

export { encrypt, decrypt, HashObject };
