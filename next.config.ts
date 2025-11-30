import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // Enable static export for GitHub Pages
  trailingSlash: true, // Required for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
