/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['placehold.co'],
    unoptimized: true, // Enable unoptimized images for static export
  },
  output: 'export', // Enable static HTML export
  distDir: 'out', // Output directory
};

module.exports = nextConfig;
