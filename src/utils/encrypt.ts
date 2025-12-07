import { createCipheriv, randomBytes, scryptSync } from "crypto";
import { Env } from "@/config/Env";

const algorithm = 'aes-256-ctr';

// Hàm mã hóa
const encrypt = (content: string, secret: string): string => {
    const secretKey = scryptSync(secret, 'salt', 32);

    const iv = randomBytes(16);
    
    const cipher = createCipheriv(algorithm, new Uint8Array(secretKey), new Uint8Array(iv));
    
    const encrypted = Buffer.concat([new Uint8Array(cipher.update(content)), new Uint8Array(cipher.final())]);

    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export default encrypt;
