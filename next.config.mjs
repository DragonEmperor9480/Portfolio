/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
    ],
  },
  // Turbopack (default in Next.js 16) handles GLB and audio natively
  // via the experimental fileExtensions rule. Empty config silences the warning.
  turbopack: {},
};

export default nextConfig;
