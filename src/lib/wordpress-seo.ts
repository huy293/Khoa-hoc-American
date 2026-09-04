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
 * Chuyển đổi dữ liệu SEO từ WordPress (Rank Math / Yoast) sang Next.js Metadata
 */
export function generateWpMetadata(
  seo?: (WPSeo & Record<string, any>) | null,
  fallback: FallbackMetadata = {}
): Metadata {
  const title = seo?.title || seo?.rank_math_title || fallback.title || 'Couture Beauty Academy';
  const description =
    seo?.metaDesc ||
    seo?.description ||
    seo?.rank_math_description ||
    extractPlainTextExcerpt(fallback.description) ||
    'Chương trình đào tạo thẩm mỹ và chăm sóc da chuyên nghiệp chuẩn quốc tế.';

  const ogImage =
    seo?.opengraphImage?.sourceUrl ||
    (typeof seo?.opengraphImage === 'string' ? seo.opengraphImage : undefined) ||
    seo?.og_image ||
    fallback.image;

  const canonicalUrl =
    seo?.canonical ||
    seo?.canonical_url ||
    seo?.rank_math_canonical_url ||
    (fallback.url ? `${SITE_URL}${fallback.url}` : undefined);

  const keywords = seo?.focusKeyword || seo?.focus_keywords || seo?.metaKeywords;

  return {
    title,
    description,
    keywords: keywords ? (Array.isArray(keywords) ? keywords : [String(keywords)]) : undefined,
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    openGraph: {
      title: seo?.opengraphTitle || seo?.og_title || title,
      description: seo?.opengraphDescription || seo?.og_description || description,
      url: canonicalUrl || '/',
      siteName: seo?.opengraphSiteName || 'Couture Beauty Academy',
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.twitterTitle || seo?.twitter_title || seo?.opengraphTitle || title,
      description: seo?.twitterDescription || seo?.twitter_description || seo?.opengraphDescription || description,
      images: seo?.twitterImage?.sourceUrl || (typeof seo?.twitterImage === 'string' ? seo.twitterImage : undefined) || ogImage ? [seo?.twitterImage?.sourceUrl || ogImage!] : undefined,
    },
    robots: {
      index: !(seo?.metaRobotsNoindex === 'noindex' || seo?.robots?.includes('noindex')),
      follow: !(seo?.metaRobotsNofollow === 'nofollow' || seo?.robots?.includes('nofollow')),
      googleBot: {
        index: !(seo?.metaRobotsNoindex === 'noindex' || seo?.robots?.includes('noindex')),
        follow: !(seo?.metaRobotsNofollow === 'nofollow' || seo?.robots?.includes('nofollow')),
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
