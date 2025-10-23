/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [process.env.NEXT_PUBLIC_S3_ENDPOINT ? process.env.NEXT_PUBLIC_S3_ENDPOINT.replace(/^https?:\/\//, '').replace(/\/.*$/, '') : ''],
  },
};

module.exports = nextConfig;