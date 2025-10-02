import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  env: {
    SUPABASE_URL: 'https://jrsrekqsmdziwfhusevb.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyc3Jla3FzbWR6aXdmaHVzZXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzEyNDksImV4cCI6MjA3MjMwNzI0OX0.UNIC7eYl2IVOXI-QsVPAsYXAicX3vp6HyJdCYa_cwjc'
  },
};

export default nextConfig;