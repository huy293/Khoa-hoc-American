export interface WPImage {
  sourceUrl?: string;
  altText?: string;
  title?: string;
  mediaDetails?: {
    width?: number;
    height?: number;
  };
}

export interface WPSeo {
  title?: string;
  metaDesc?: string;
  metaKeywords?: string;
  canonical?: string;
  opengraphTitle?: string;
  opengraphDescription?: string;
  opengraphSiteName?: string;
  opengraphImage?: {
    sourceUrl?: string;
  };
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: {
    sourceUrl?: string;
  };
  metaRobotsNoindex?: string;
  metaRobotsNofollow?: string;
  schema?: any;
  [key: string]: unknown;
}

export interface WPSiteSettings {
  title?: string;
  description?: string;
  logoUrl?: string;
  faviconUrl?: string;
  hotline?: string;
  phone?: string;
  email?: string;
  address?: string;
  zaloUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  copyrightText?: string;
  [key: string]: unknown;
}

export interface WPPost {
  id: string;
  databaseId?: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  date?: string;
  modified?: string;
  featuredImage?: {
    node?: WPImage;
  };
  author?: {
    node?: {
      name?: string;
      avatar?: {
        url?: string;
      };
    };
  };
  categories?: {
    nodes: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  };
  tags?: {
    nodes: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  };
  seo?: WPSeo;
  [key: string]: unknown;
}

export interface WPPage {
  id: string;
  databaseId?: number;
  title: string;
  slug: string;
  content?: string;
  date?: string;
  modified?: string;
  featuredImage?: {
    node?: WPImage;
  };
  seo?: WPSeo;
  [key: string]: unknown;
}

export interface WPCourse {
  id: string;
  databaseId?: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  date?: string;
  modified?: string;
  featuredImage?: {
    node?: WPImage;
  };
  courseFields?: {
    duration?: string;
    level?: string;
    price?: number | string;
    originalPrice?: number | string;
    instructor?: string;
    curriculum?: Array<{
      title: string;
      lessons: string[];
    }>;
    benefits?: string[];
    [key: string]: unknown;
  };
  seo?: WPSeo;
  [key: string]: unknown;
}

export interface WPProduct {
  id: string | number;
  databaseId?: number;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price?: string;
  regularPrice?: string;
  salePrice?: string;
  onSale?: boolean;
  stock?: number;
  date?: string;
  modified?: string;
  image?: WPImage;
  galleryImages?: {
    nodes: WPImage[];
  };
  categories?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  [key: string]: unknown;
}

export interface WPMenuItem {
  id: string;
  label: string;
  path: string;
  url?: string;
  parentId?: string | null;
  childItems?: {
    nodes: WPMenuItem[];
  };
}

export interface WPGraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
    extensions?: Record<string, unknown>;
  }>;
}

export interface FetchOptions extends RequestInit {
  revalidate?: number | false;
  tags?: string[];
  retries?: number;
}
