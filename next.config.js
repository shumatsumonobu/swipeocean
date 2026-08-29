const path = require("path");
// const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
// initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  turbopack: {
    root: path.resolve(__dirname),
  },
};

module.exports = nextConfig;
