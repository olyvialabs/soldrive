import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .refine(
        (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
        "You forgot to change the default URL",
      ),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    STRIPE_SECRET_KEY: z.string(),
    POSTMARK_API_KEY: z.string(),
    JWT_KEY: z.string(),
    STRIPE_PRODUCT_ID_BASIC: z.string(),
    STRIPE_PRODUCT_ID_ALL_ACCESS: z.string(),
    STRIPE_PRODUCT_ID_CHATGPT_TEMPLATE: z.string(),
    STRIPE_PRODUCT_ID_STORE_TEMPLATE: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: z.string(),
    NEXT_PUBLIC_JWT_KEY: z.string(),

    NEXT_PUBLIC_STRIPE_PRODUCT_ID_BASIC: z.string(),
    NEXT_PUBLIC_STRIPE_PRODUCT_ID_ALL_ACCESS: z.string(),
    NEXT_PUBLIC_STRIPE_PRODUCT_ID_CHATGPT_TEMPLATE: z.string(),
    NEXT_PUBLIC_STRIPE_PRODUCT_ID_STORE_TEMPLATE: z.string(),
    NEXT_PUBLIC_EXPO_PREVIEW_URL: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    POSTMARK_API_KEY: process.env.POSTMARK_API_KEY,
    NEXT_PUBLIC_JWT_KEY: process.env.NEXT_PUBLIC_JWT_KEY,
    JWT_KEY: process.env.NEXT_PUBLIC_JWT_KEY,
    STRIPE_PRODUCT_ID_BASIC: process.env.STRIPE_PRODUCT_ID_BASIC,
    STRIPE_PRODUCT_ID_ALL_ACCESS: process.env.STRIPE_PRODUCT_ID_ALL_ACCESS,
    STRIPE_PRODUCT_ID_CHATGPT_TEMPLATE:
      process.env.STRIPE_PRODUCT_ID_CHATGPT_TEMPLATE,
    STRIPE_PRODUCT_ID_STORE_TEMPLATE:
      process.env.STRIPE_PRODUCT_ID_STORE_TEMPLATE,

    NEXT_PUBLIC_STRIPE_PRODUCT_ID_BASIC:
      process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_BASIC,
    NEXT_PUBLIC_STRIPE_PRODUCT_ID_ALL_ACCESS:
      process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_ALL_ACCESS,
    NEXT_PUBLIC_STRIPE_PRODUCT_ID_CHATGPT_TEMPLATE:
      process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_CHATGPT_TEMPLATE,
    NEXT_PUBLIC_STRIPE_PRODUCT_ID_STORE_TEMPLATE:
      process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_STORE_TEMPLATE,
    NEXT_PUBLIC_EXPO_PREVIEW_URL: process.env.NEXT_PUBLIC_EXPO_PREVIEW_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
