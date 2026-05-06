/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development'

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''};
  style-src 'self' 'unsafe-inline';
  font-src 'self';
  img-src 'self' data: blob:;
  connect-src 'self'
    https://*.supabase.co
    https://api.lemonsqueezy.com
    https://api.anthropic.com
    https://va.vercel-scripts.com${isDev ? ' ws://localhost:3000' : ''};
  script-src-elem 'self' 'unsafe-inline' https://va.vercel-scripts.com${isDev ? " 'unsafe-eval'" : ''};
  frame-src https://*.lemonsqueezy.com https://mementoai-app.lemonsqueezy.com;
  frame-ancestors 'none';
`.replace(/\n/g, ' ')

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'microphone=(self)' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy,
  },
]

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse'],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}

module.exports = nextConfig
