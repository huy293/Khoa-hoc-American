import { MetadataRoute } from 'next';
import { getWpCourses, getWpPosts, getWpProducts } from '@/lib/wordpress-queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const paths = ['', '/courses', '/resources', '/about-us', '/shop', '/contact'];
  const staticRoutes: MetadataRoute.Sitemap = paths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' || path === '/courses' || path === '/shop' ? 'daily' : 'monthly',
    priority: path === '' ? 1.0 : path === '/courses' ? 0.9 : 0.8,
  }));

  try {
    const courses = await getWpCourses(50);
    const courseRoutes: MetadataRoute.Sitemap = (courses || []).map((course) => ({
      url: `${siteUrl}/courses/${course.slug}`,
      lastModified: course.modified ? new Date(course.modified) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

    const products = await getWpProducts(50);
    const productRoutes: MetadataRoute.Sitemap = (products || []).map((product) => ({
      url: `${siteUrl}/shop/${product.slug}`,
      lastModified: product.modified ? new Date(product.modified) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    }));

    return [...staticRoutes, ...courseRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
