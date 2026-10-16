import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Browser-visible variables are named PB_* instead of NEXT_PUBLIC_*, so Next.js only inlines
  // the ones listed here.
  env: {
    PB_SUPABASE_URL: process.env.PB_SUPABASE_URL ?? "",
    PB_SUPABASE_PUBLISHABLE_KEY: process.env.PB_SUPABASE_PUBLISHABLE_KEY ?? "",
    PB_COOKIE_DOMAIN: process.env.PB_COOKIE_DOMAIN ?? "",
    PB_CALCULATOR_URL: process.env.PB_CALCULATOR_URL ?? "",
    PB_TOOLS_URL: process.env.PB_TOOLS_URL ?? "",
    PB_STORE_URL: process.env.PB_STORE_URL ?? "",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
