/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    WS_URL: "wss://xoxo-backend.onrender.com/"
  }
}

module.exports = nextConfig
