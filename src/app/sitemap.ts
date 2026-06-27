import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tools.khatahisab.in';
  const lastModified = new Date();

  // Define all the routes in the application
  const routes = [
    '',
    '/age-calculator',
    '/bg-remover',
    '/business-booster',
    '/image-compressor',
    '/json-formatter',
    '/pdf-magic',
    '/qr-generator',
    '/word-counter',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
    '/refund-policy',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route.includes('policy') || route.includes('terms') ? 0.5 : 0.8,
  }));
}
