/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['placehold.co'],
    // unoptimized: true, // Remove for Vercel, unless you want to keep it
  },
  experimental: {},
};

module.exports = nextConfig;
