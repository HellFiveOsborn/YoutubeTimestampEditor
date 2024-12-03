import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const userAgent = req.headers.get('user-agent')?.toLowerCase() || '';
  const isBot = userAgent.includes('bot') || 
               userAgent.includes('crawler') || 
               userAgent.includes('spider') ||
               userAgent.includes('facebook') ||
               userAgent.includes('whatsapp') ||
               userAgent.includes('telegram');

  console.log('Middleware - isBot:', isBot, 'UserAgent:', userAgent);

  if (isBot && req.nextUrl.pathname === '/watch') {
    // Let Next.js handle bot requests to /watch
    return NextResponse.next();
  }
  
  // For non-bot requests, redirect to the Vite app
  const url = new URL(req.url);
  const viteUrl = new URL(`http://localhost:5174${url.pathname}${url.search}`);
  return NextResponse.redirect(viteUrl);
}

// Configure middleware to only run on /watch route
export const config = {
  matcher: '/watch',
};
