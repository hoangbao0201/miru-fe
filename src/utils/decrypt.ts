import { createDecipheriv, scryptSync } from "crypto";

const algorithm = 'aes-256-ctr';

const decrypt = (encryptedContent: string, secret: string): string => {
    const secretKey = Uint8Array.from(scryptSync(secret, 'salt', 32));

    const [ivHex, encryptedHex] = encryptedContent.split(':');
    
    const iv = new Uint8Array(Buffer.from(ivHex, 'hex'));

    const encryptedText = new Uint8Array(Buffer.from(encryptedHex, 'hex'));

    const decipher = createDecipheriv(algorithm, secretKey, iv);

    const decrypted = Buffer.concat([new Uint8Array(decipher.update(encryptedText)), new Uint8Array(decipher.final())]);

    return decrypted.toString();
}

export default decrypt;
