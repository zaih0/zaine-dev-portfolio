import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  experimental: {
    webpackMemoryOptimizations: true,
    preloadEntriesOnStart: false,
  },
};

export default nextConfig;
