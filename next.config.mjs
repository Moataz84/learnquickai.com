/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    }
  },
  serverExternalPackages: ["youtube-dl-exec", "fluent-ffmpeg", "ffmpeg-static", "ffprobe-static"]
};

export default nextConfig;
