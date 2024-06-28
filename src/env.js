import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const SolanaClusterEnum = z.enum(["mainnet-beta", "testnet", "devnet"]);

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {},
  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_SOLANA_CLUSTER_API: z.string(),
    NEXT_PUBLIC_USERS_CONTRACT_ADDRESS: z.string(),
    NEXT_PUBLIC_FILES_RELATIONSHIP_CONTRACT_ADDRESS: z.string(),
    NEXT_PUBLIC_INDEXER_SERVICE_URL: z.string(),
    NEXT_PUBLIC_APP_URL: z.string(),
    NEXT_PUBLIC_SUBSCRIPTION_RELATIONSHIP_CONTRACT_ADDRESS: z.string(),
    NEXT_PUBLIC_BONK_TOKEN_ADDRESS: z.string(),
    NEXT_PUBLIC_BONK_DESTINATION_WALLET_ADDRESS: z.string(),
    NEXT_PUBLIC_SOLANA_NETWORK: SolanaClusterEnum
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NEXT_PUBLIC_SOLANA_CLUSTER_API: process.env.NEXT_PUBLIC_SOLANA_CLUSTER_API,
    NEXT_PUBLIC_USERS_CONTRACT_ADDRESS:
      process.env.NEXT_PUBLIC_USERS_CONTRACT_ADDRESS,
    NEXT_PUBLIC_FILES_RELATIONSHIP_CONTRACT_ADDRESS:
      process.env.NEXT_PUBLIC_FILES_RELATIONSHIP_CONTRACT_ADDRESS,
    NEXT_PUBLIC_INDEXER_SERVICE_URL: process.env.NEXT_PUBLIC_INDEXER_SERVICE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUBSCRIPTION_RELATIONSHIP_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_SUBSCRIPTION_RELATIONSHIP_CONTRACT_ADDRESS,
    NEXT_PUBLIC_BONK_TOKEN_ADDRESS: process.env.NEXT_PUBLIC_BONK_TOKEN_ADDRESS,
    NEXT_PUBLIC_BONK_DESTINATION_WALLET_ADDRESS: process.env.NEXT_PUBLIC_BONK_DESTINATION_WALLET_ADDRESS,
    NEXT_PUBLIC_SOLANA_NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK
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
