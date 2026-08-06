import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  basePath: '',
  trailingSlash: true,
  // Performance optimizations
  compiler: {
    // Strips console.log noise from the client bundle, but keeps warn/error:
    // the build-time content checks in lib/problems.ts report through them.
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['warn', 'error'] } : false,
  },
  swcMinify: true,
  reactStrictMode: true,
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)

