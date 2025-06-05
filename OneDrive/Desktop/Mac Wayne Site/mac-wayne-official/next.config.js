/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Simplified config to rule out issues
  images: {
    domains: ['placehold.co'],
  },
  // Remove all experimental features temporarily
  experimental: {},
};

module.exports = nextConfig;
