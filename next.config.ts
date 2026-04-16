import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: "/checkout/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://secure.nmi.com https://secure.networkmerchants.com",
              "frame-src 'self' https://secure.nmi.com https://secure.networkmerchants.com",
              "connect-src 'self' https://secure.nmi.com https://secure.networkmerchants.com https://*.convex.cloud",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
