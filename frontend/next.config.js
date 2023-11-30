/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    WS_URL: process.env.NODE_ENV === 'production' ? "wss://xoxo-backend.onrender.com/" : "ws://localhost:8080/",
  },
}



module.exports = nextConfig

