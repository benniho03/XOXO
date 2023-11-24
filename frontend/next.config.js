/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    WS_URL: "ws://localhost:8080"
  }
}

module.exports = nextConfig
