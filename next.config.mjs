/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    nodeMiddleware: true,
    serverActions: {
      bodySizeLimit: "5mb",
    }
  },
  serverExternalPackages: ["fluent-ffmpeg", "ffmpeg-static", "ffprobe-static"]
};

export default nextConfig;