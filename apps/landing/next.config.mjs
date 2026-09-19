/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@smartseba/utils', '@smartseba/ui', '@smartseba/types', '@smartseba/config'],
  async rewrites() {
    return [
      { source: '/api/:path*', destination: 'http://127.0.0.1:4000/api/:path*' },
      { source: '/admin/:path*', destination: 'http://127.0.0.1:3001/admin/:path*' },
    ];
  },
};
export default nextConfig;
