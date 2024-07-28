/* eslint-disable */
// const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin")

const { patchWebpackConfig } = require('next-global-css')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],

  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },

  // webpack: (config, options) => {
  //   patchWebpackConfig(config, options)

  //   return config
  // },

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
