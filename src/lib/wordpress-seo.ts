import type { Metadata } from 'next';
import { WPSeo } from '@/types/wordpress';
import { SITE_URL } from './wordpress';
import { extractPlainTextExcerpt } from './wordpress-format';

interface FallbackMetadata {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

/**
 * Chuyển đổi dữ liệu SEO từ WordPress (Yoast / Rank Math) sang Next.js Metadata
 */
export function generateWpMetadata(
  seo?: WPSeo | null,
  fallback: FallbackMetadata = {}
): Metadata {
  const title = seo?.title || fallback.title || 'Couture Beauty Academy';
  const description =
    seo?.metaDesc ||
    extractPlainTextExcerpt(fallback.description) ||
    'Chương trình đào tạo thẩm mỹ và chăm sóc da chuyên nghiệp chuẩn quốc tế.';

  const ogImage = seo?.opengraphImage?.sourceUrl || fallback.image;
  const canonicalUrl = seo?.canonical || (fallback.url ? `${SITE_URL}${fallback.url}` : undefined);

  return {
    title,
    description,
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    openGraph: {
      title: seo?.opengraphTitle || title,
      description: seo?.opengraphDescription || description,
      url: canonicalUrl || '/',
      siteName: seo?.opengraphSiteName || 'Couture Beauty Academy',
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.twitterTitle || seo?.opengraphTitle || title,
      description: seo?.twitterDescription || seo?.opengraphDescription || description,
      images: seo?.twitterImage?.sourceUrl || ogImage ? [seo?.twitterImage?.sourceUrl || ogImage!] : undefined,
    },
    robots: {
      index: !(seo?.metaRobotsNoindex === 'noindex'),
      follow: !(seo?.metaRobotsNofollow === 'nofollow'),
      googleBot: {
        index: !(seo?.metaRobotsNoindex === 'noindex'),
        follow: !(seo?.metaRobotsNofollow === 'nofollow'),
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Tạo Metadata nhanh cho Post / Course / Service
 */
export function buildWpPageMetadata(
  pageData?: { title?: string; excerpt?: string; content?: string; seo?: WPSeo; featuredImage?: { node?: { sourceUrl?: string } } } | null,
  slug = '',
  basePath = '/courses'
): Metadata {
  if (!pageData) {
    return {
      title: 'Couture Beauty Academy',
      description: 'Chương trình đào tạo làm đẹp và chăm sóc da chuyên nghiệp.',
    };
  }

  return generateWpMetadata(pageData.seo, {
    title: `${pageData.title} - Couture Beauty Academy`,
    description: pageData.excerpt || extractPlainTextExcerpt(pageData.content),
    image: pageData.featuredImage?.node?.sourceUrl,
    url: `${basePath}/${slug}`,
  });
}
