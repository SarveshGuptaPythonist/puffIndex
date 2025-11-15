/** @type {import('next').NextConfig} */
const nextConfig = {
  // Forces Next to use Webpack instead of Turbopack for build & prod
  webpack(config, { isServer }) {
    // No modifications needed unless you have custom loaders
    return config;
  },

  // Transpile Chakra's packages so they're bundled properly
  transpilePackages: [
    "@chakra-ui/react",
    "@chakra-ui/utils",
    "@chakra-ui/system",
  ],

  // Fallback: use the Webpack flag in npm scripts
  // (See below)
};

module.exports = nextConfig;
