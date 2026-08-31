import { MetadataRoute } from 'next';
import { getWpCourses, getWpPosts, getWpProducts } from '@/lib/wordpress-queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${siteUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  try {
    const courses = await getWpCourses(50);
    const courseRoutes: MetadataRoute.Sitemap = (courses || []).map((course) => ({
      url: `${siteUrl}/courses/${course.slug}`,
      lastModified: course.modified ? new Date(course.modified) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

    const posts = await getWpPosts(50);
    const postRoutes: MetadataRoute.Sitemap = (posts || []).map((post) => ({
      url: `${siteUrl}/resources/${post.slug}`,
      lastModified: post.modified ? new Date(post.modified) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    const products = await getWpProducts(50);
    const productRoutes: MetadataRoute.Sitemap = (products || []).map((product) => ({
      url: `${siteUrl}/shop/${product.slug}`,
      lastModified: product.modified ? new Date(product.modified) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    }));

    return [...staticRoutes, ...courseRoutes, ...postRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
