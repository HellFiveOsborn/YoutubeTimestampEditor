const withTM = require('next-transpile-modules')(['react-dom']);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Handle bot requests differently
  async middleware(req) {
    const userAgent = req.headers.get('user-agent')?.toLowerCase() || '';
    const isBot = userAgent.includes('bot') || 
                 userAgent.includes('crawler') || 
                 userAgent.includes('spider') ||
                 userAgent.includes('facebook') ||
                 userAgent.includes('whatsapp') ||
                 userAgent.includes('telegram');

    if (isBot && req.nextUrl.pathname === '/watch') {
      return true; // Let Next.js handle bot requests to /watch
    }
    
    // For non-bot requests, redirect to the Vite app
    return Response.redirect(new URL(req.url.replace(':3000', ':5174')));
  },
}

module.exports = withTM(nextConfig);
