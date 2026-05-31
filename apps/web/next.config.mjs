/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better error detection
  reactStrictMode: true,

  // Transpile workspace packages
  transpilePackages: ['@echobridge/shared'],

  // Headers for WebRTC requirements
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Required for getDisplayMedia in some browsers
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
    ]
  },
}

export default nextConfig
