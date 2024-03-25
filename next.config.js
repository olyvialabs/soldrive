/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!

    /// PLEASE FOR GODSEIK REMOVE THIS
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.

    // PLEASE GET BACK THIS TO FALSE ONCE THE TEST BUILD IS UP
    ignoreDuringBuilds: true,
  },
};

export default config;
