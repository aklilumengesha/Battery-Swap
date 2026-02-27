const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ['images.unsplash.com'],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
    prependData: `@import "variables.css";`,
  },
};

module.exports = nextConfig;
