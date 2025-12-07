import { AES, enc, pad, lib, mode, HmacSHA256 } from "crypto-js";

const cfg = {
    mode: mode.CBC,
    padding: pad.Pkcs7,
};

const generateRandomIV = () => {
    return lib.WordArray.random(128 / 8);
}

export const encryptAESData = async ({
    content,
    secretKey,
}: {
    content: string;
    secretKey: string;
}) => {
    const iv = generateRandomIV();
    const encrypted = AES.encrypt(
        content,
        secretKey,
        {
            iv: iv,
            mode: cfg.mode,
            padding: cfg.padding,
        }
    );

    return iv.toString() + ':' + encrypted.toString();
}

export const decryptAESData = async ({
    content,
    secretKey,
}: {
    content: string;
    secretKey: string;
}) => {
    const [ivString, encryptedContent] = content.split(':');
    if (!ivString || !encryptedContent) {
        return null;
    }

    const iv = enc.Hex.parse(ivString);

    const decrypted = AES.decrypt(
        encryptedContent,
        secretKey,
        {
            iv: iv,
            mode: cfg.mode,
            padding: cfg.padding,

        }
    );

    if (decrypted) {
        const str = decrypted.toString(enc.Utf8);
        return str.length > 0 ? str : null;
    }
    return null;
}

export const encryptHMACData = ({
    content,
    secretKey,
}: {
    content: string;
    secretKey: string;
}) => {
    return (
        HmacSHA256(content, secretKey).toString()
    )
}

export const verifyHMAC = ({
    message, receivedHMAC, secretKey
}: {
    message: string, receivedHMAC: string, secretKey: string
}) => {
    const generatedHMAC = HmacSHA256(message, secretKey).toString();
  
    return generatedHMAC === receivedHMAC;
}

export const decryptUrlImageChapter = (plaintext: string, secretKey: string): string => {
    const secretCode = secretKey.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    let text = '';
  
    for (let i = 0; i < plaintext.length; i += 3) {
      const encryptedChar = parseInt(plaintext.slice(i, i + 3), 10);
      const charCode = encryptedChar - (secretCode % 100);
      text += String.fromCharCode(charCode);
    }
  
    return text;
};
  