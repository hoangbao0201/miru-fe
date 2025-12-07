import { BrowserType, EBrowser } from "./constants";

/**
 * url completion
 * @example '' -> /
 * @example path -> /path
 * @example /path -> /path
 * @param url
 */
export const completion = (url: string) => {
    if (!url) {
        return "/";
    }
    return url[0] !== "/" ? `/${url}` : url;
};

/**
 * detect browser
 */
export const isUserAgentContains = (text: string) => {
    return ~navigator.userAgent.toLowerCase().indexOf(text);
};

export const isString = (v: any): v is string => typeof v === "string";

export const locationChange = (target: string, env?: BrowserType) => {
    // Safari 15 has bfcache. prevent click history back button
    if (env === EBrowser.Safari) {
        location.replace(target);
        return;
    }
    location.href = target;
};

// export const isUserAgentAllowed = (): boolean => {
//   const allowedBots = new Set([
//     // Google Bots
//     'googlebot',
//     'googlebot-image',
//     'googlebot-video',
//     'googlebot-news',
//     'adsbot-google',
//     'mediapartners-google',
//     'google page speed insights',

//     // Bing Bots
//     'bingbot',
//     'adidxbot',
//     'msnbot',

//     // Yahoo Bots
//     'yahoo! slurp',

//     // Yandex Bots
//     'yandexbot',
//     'yandeximages',
//     'yandexvideo',
//     'yandexmediarobot',
//     'yandexnews',

//     // Baidu Bots
//     'baiduspider',
//     'baiduspider-image',
//     'baiduspider-video',

//     // Social Media Bots
//     'facebookexternalhit',
//     'facebookcatalog',
//     'twitterbot',
//     'linkedinbot',
//     'pinterestbot',
//     'whatsapp',
//     'telegrambot',

//     // DuckDuckGo Bots
//     'duckduckbot',

//     // Apple Bots
//     'applebot',

//     // SEO Tools & Analysis
//     'ahrefsbot',
//     'semrushbot',
//     'mj12bot',
//     'moz',
//     'screaming frog seo spider',
//     'seokicks-robot',
//     'sitebulb',

//     // Other Crawlers
//     'alexa crawler',
//     'bingpreview',
//     'ccbot',
//     'dotbot',
//     'uptimerobot',
//     'petalbot',
//     'sogou spider',
//     'smilebot',
//   ]);

//   const userAgent = navigator.userAgent.toLowerCase();
//   return Array.from(allowedBots).some(bot => userAgent.includes(bot));
// };

export const isUserAgentAllowed = (): boolean => {
    const allowedBots = new Set([
        "googlebot",
        "google page speed insights",
        "bingbot",
        "yahoo! slurp",
        "yandexbot",
        "baiduspider",
        "duckduckbot",
        "facebookexternalhit",
        "applebot",
        "ahrefsbot",
        "semrushbot",
    ]);

    const userAgent = navigator.userAgent.toLowerCase();
    const isBot = Array.from(allowedBots).some((bot) =>
        userAgent.includes(bot)
    );

    return isBot;
};
