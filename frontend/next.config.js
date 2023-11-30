/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // WS_URL: "wss://xoxo-backend.onrender.com/",
    WS_URL: "ws://localhost:8080/",
  },
}

module.exports = nextConfig
