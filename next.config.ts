import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Next.js 16 configuration */
  
  // Enable Next.js 16 Cache Components for better performance
  // cacheComponents: true,
  
  // Enable React Compiler for automatic optimizations (moved from experimental in Next.js 16)
  reactCompiler: true,
  
  // Image optimization with remote patterns for Supabase storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
