/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: 'ade-stylish.s3.ap-northeast-1.amazonaws.com',
        pathname: '**'
      }
    ],
  },
  async redirects() {
    return [
      {
        source: "/login",
        has: [
          {
            type: "cookie",
            key: "token",
          },
        ],
        permanent: false,
        destination: "/",
      },
      {
        source: "/",
        missing: [
          {
            type: "cookie",
            key: "token",
          },
        ],
        permanent: false,
        destination: "/login",
      },
    ];
  },
};

module.exports = nextConfig;
