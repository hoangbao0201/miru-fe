
export type IconProps = {
    color?: string;
    size?: string | number;
} & React.SVGAttributes<SVGElement>;

export enum BookType {
    beebook = 'beebook',
};

export enum LanguageCode {
    en_US = 'en_US', // English (United States)
    vi_VN = 'vi_VN', // Vietnamese (Vietnam)
    fr_FR = 'fr_FR', // French (France)
    es_ES = 'es_ES', // Spanish (Spain)
    de_DE = 'de_DE', // German (Germany)
    ja_JP = 'ja_JP', // Japanese (Japan)
    ko_KR = 'ko_KR', // Korean (South Korea)
    zh_CN = 'zh_CN', // Chinese (Simplified, China)
    zh_TW = 'zh_TW', // Chinese (Traditional, Taiwan)
    ru_RU = 'ru_RU', // Russian (Russia)
    pt_BR = 'pt_BR', // Portuguese (Brazil)
    ar_SA = 'ar_SA', // Arabic (Saudi Arabia)
}

export const supportedLanguageCount = Object.values(LanguageCode).length;