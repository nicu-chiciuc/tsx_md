/* eslint-disable */
// const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin")

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    // ignoreDuringBuilds: true,
  },

  experimental: {
    esmExternals: true,
  },

  // https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-monorepo
  // webpack: (config, { isServer }) => {
  // 	if (isServer) {
  // 		config.plugins = [...config.plugins, new PrismaPlugin()]
  // 	}

  // 	return config
  // },
}

module.exports = nextConfig
