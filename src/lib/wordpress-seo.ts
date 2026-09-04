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

/**
 * ⚡ Tạo Schema JSON-LD cho Khóa học (Course Schema)
 */
export function buildCourseSchema(course: any) {
  if (!course) return null;

  // Nếu Rank Math đã cấu hình schema riêng thì ưu tiên dùng
  if (course.seo?.schema) {
    return course.seo.schema;
  }

  const rawPrice = String(course.courseFields?.price || '').replace(/[^0-9.]/g, '') || '1200';

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.excerpt || course.courseFields?.subtitle || course.title,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Couture Beauty Academy',
      sameAs: 'https://course.homenest.edu.vn',
    },
    offers: {
      '@type': 'Offer',
      category: 'Paid',
      price: rawPrice,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Blended',
      instructor: {
        '@type': 'Person',
        name: course.courseFields?.trainer?.name || 'Kathleen trainer',
      },
    },
  };
}

/**
 * ⚡ Tạo Schema JSON-LD cho Sản phẩm (Product Schema)
 */
export function buildProductSchema(product: any) {
  if (!product) return null;

  if (product.seo?.schema) {
    return product.seo.schema;
  }

  const rawPrice = String(product.price || '').replace(/[^0-9.]/g, '') || '0';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image?.sourceUrl ? [product.image.sourceUrl] : undefined,
    description: product.shortDescription || product.description || product.name,
    offers: {
      '@type': 'Offer',
      price: rawPrice,
      priceCurrency: 'USD',
      availability: (product.stock ?? 1) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };
}

/**
 * ⚡ Tạo Schema JSON-LD cho Tổ chức (Organization / EducationalOrganization)
 */
export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Couture Beauty Academy',
    url: 'https://course.homenest.edu.vn',
    logo: 'https://course.homenest.edu.vn/images/home/couture_logo.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '9889 Bellaire Blvd, Suite 218',
      addressLocality: 'Houston',
      addressRegion: 'TX',
      postalCode: '77036',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-713-555-0199',
      contactType: 'admissions',
    },
  };
}

