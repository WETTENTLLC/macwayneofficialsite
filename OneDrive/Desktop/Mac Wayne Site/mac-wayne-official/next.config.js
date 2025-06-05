/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Simplified config to rule out issues
  images: {
    domains: ['placehold.co'],
    unoptimized: true, // Required for static export
  },
  // Configure for static export
  output: 'export',
  // Configure the base path for GitHub Pages
  basePath: '/macwayneofficialsite',
  // Remove all experimental features temporarily
  experimental: {},
};

module.exports = nextConfig;
