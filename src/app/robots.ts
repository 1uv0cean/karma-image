import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/', // Don't crawl API routes
    },
    sitemap: 'https://k-face-reading.com/sitemap.xml',
  };
}
