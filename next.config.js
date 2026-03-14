/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['mongoose']
  },
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  }
}

module.exports = nextConfig
