import { withContentCollections } from "@content-collections/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.hetam.vercel.app", // Cloudflare R2 Storage
      },
      {
        protocol: "https",
        hostname: "assets.hetam.vercel.app", // Cloudflare R2 Storage
      },
    ],
  },
  serverExternalPackages: ["@react-pdf/renderer", "jotai-devtools"],
  productionBrowserSourceMaps: true,
  devIndicators: false,
  reactStrictMode: true,
};

export default withContentCollections(nextConfig);
