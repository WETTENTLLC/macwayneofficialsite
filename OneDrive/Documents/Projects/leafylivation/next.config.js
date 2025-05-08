/** @type {import('next').NextConfig} */
const repo = 'leafylivation-repository';
const nextConfig = {
  output: 'export', // Enable static export for GitHub Pages
  images: {
    unoptimized: true, // Required for static export if using next/image
  },
  basePath: '/' + repo,
  assetPrefix: '/' + repo + '/',
};

module.exports = nextConfig;