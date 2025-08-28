import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'Content-Security-Policy', value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.chatwoot.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https: https://app.chatwoot.com",
      "media-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https: https://app.chatwoot.com wss://app.chatwoot.com",
      "frame-src 'self' https://app.chatwoot.com",
      "frame-ancestors 'self'",
    ].join('; ') },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  // Temporary reduced HSTS while debugging SSL issue (err_ssl_protocol_error)
  { key: 'Strict-Transport-Security', value: 'max-age=300; includeSubDomains' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
