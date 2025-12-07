import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const Env = createEnv({
  server: {
    NEXTAUTH_SECRET: z.string(),
  },
  client: {
    
  },
  shared: {
    NEXT_PUBLIC_APP_RIDIRECT_URL: z.string(),
    NEXT_PUBLIC_APP_URL: z.string(),
    NEXT_PUBLIC_API_URL: z.string(),
    NEXT_PUBLIC_API_UPLOAD_URL: z.string(),
    NEXT_PUBLIC_ANALYTICS_ID: z.string(),
    NEXT_PUBLIC_CAPTCHA_TURNSTILE_SITE_KEY: z.string(),

    NEXT_PUBLIC_TITLE_SEO: z.string(),
    NEXT_PUBLIC_CONTENT_PAGE: z.string(),
    NEXT_PUBLIC_FACEBOOK_URL_SEO: z.string(),
    NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO: z.string(),

    NEXT_PUBLIC_SECRET_DATA_CHAPTER: z.string(),

    NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
  },
  // You need to destructure all the keys manually
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_RIDIRECT_URL: process.env.NEXT_PUBLIC_APP_RIDIRECT_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_API_UPLOAD_URL: process.env.NEXT_PUBLIC_API_UPLOAD_URL,
    NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
    NEXT_PUBLIC_CAPTCHA_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_CAPTCHA_TURNSTILE_SITE_KEY,

    NEXT_PUBLIC_TITLE_SEO: process.env.NEXT_PUBLIC_TITLE_SEO,
    NEXT_PUBLIC_CONTENT_PAGE: process.env.NEXT_PUBLIC_CONTENT_PAGE,
    NEXT_PUBLIC_FACEBOOK_URL_SEO: process.env.NEXT_PUBLIC_FACEBOOK_URL_SEO,
    NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO: process.env.NEXT_PUBLIC_IMAGE_DOMAIN_URL_SEO,

    NEXT_PUBLIC_SECRET_DATA_CHAPTER: process.env.NEXT_PUBLIC_SECRET_DATA_CHAPTER,

    // SERVER
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
});
