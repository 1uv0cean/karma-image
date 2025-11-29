import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://k-face-reading.com';
  const languages = ['en', 'ko', 'ja', 'th'];
  const routes = ['', '/scan', '/result', '/quiz'];

  const sitemap: MetadataRoute.Sitemap = [];

  // Add root URL (redirects based on browser language)
  sitemap.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  });

  // Add localized URLs
  languages.forEach((lang) => {
    routes.forEach((route) => {
      sitemap.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '/result' ? 'always' : 'daily',
        priority: route === '' ? 1 : 0.8,
      });
    });
  });

  return sitemap;
}
