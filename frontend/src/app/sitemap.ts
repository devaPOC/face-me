import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://faceme.switchspace.in',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];
}
