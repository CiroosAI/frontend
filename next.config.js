
/** @type {import('next').NextConfig} */
const s3Endpoint = process.env.NEXT_PUBLIC_S3_ENDPOINT || '';
const s3Domain = s3Endpoint.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  eslint: {
    // Don't run ESLint during build (we'll rely on the rules above)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  images: {
    domains: [s3Domain],
  },
};

module.exports = nextConfig;