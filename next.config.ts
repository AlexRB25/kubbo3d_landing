import type { NextConfig } from "next";

// Addresses of the Kubbo3D sites: the real ones when building for production, localhost while developing.
// Each can be changed with its variable.
const production = process.env.NODE_ENV === "production";
const site = (value: string | undefined, live: string, local: string) => value || (production ? live : local);

const nextConfig: NextConfig = {
  // Browser-visible variables are named PB_* instead of NEXT_PUBLIC_*, so Next.js only inlines
  // the ones listed here.
  env: {
    PB_SUPABASE_URL: process.env.PB_SUPABASE_URL ?? "",
    PB_SUPABASE_PUBLISHABLE_KEY: process.env.PB_SUPABASE_PUBLISHABLE_KEY ?? "",
    PB_COOKIE_DOMAIN: process.env.PB_COOKIE_DOMAIN ?? "",
    PB_CALCULATOR_URL: site(process.env.PB_CALCULATOR_URL, "https://calculator.kubbo3d.com", "http://localhost:3001"),
    PB_TOOLS_URL: site(process.env.PB_TOOLS_URL, "https://tools.kubbo3d.com", "http://localhost:3002"),
    PB_STORE_URL: site(process.env.PB_STORE_URL, "https://calculator.kubbo3d.com/tienda", "http://localhost:3001/tienda"),
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
