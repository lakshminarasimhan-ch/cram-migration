/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed static export for Netlify plugin compatibility
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
