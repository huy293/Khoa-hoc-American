import {
  WPCourse,
  WPPost,
  WPPage,
  WPProduct,
  WPSiteSettings,
  WPMenuItem,
} from '@/types/wordpress';
import { fetchGraphQL, fetchWpRest } from './wordpress';

/**
 * Lấy danh sách khóa học (Custom Post Type 'course' hoặc 'courses')
 */
export async function getWpCourses(first = 20): Promise<WPCourse[]> {
  const query = `
    query GetCourses($first: Int!) {
      courses(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          databaseId
          title
          slug
          excerpt
          content
          date
          modified
          featuredImage {
            node {
              sourceUrl
              altText
              title
            }
          }
          courseFields {
            duration
            level
            price
            originalPrice
            instructor
            benefits
          }
          seo {
            title
            metaDesc
            canonical
            opengraphTitle
            opengraphDescription
            opengraphImage {
              sourceUrl
            }
          }
        }
      }
    }
  `;

  try {
    const data = await fetchGraphQL<{ courses?: { nodes: WPCourse[] } }>(query, { first });
    return data?.courses?.nodes || [];
  } catch (error) {
    console.warn('Không thể lấy courses qua GraphQL:', error);
    return [];
  }
}

/**
 * Lấy chi tiết khóa học theo Slug
 */
export async function getWpCourseBySlug(slug: string): Promise<WPCourse | null> {
  const query = `
    query GetCourseBySlug($slug: ID!) {
      course(id: $slug, idType: SLUG) {
        id
        databaseId
        title
        slug
        excerpt
        content
        date
        modified
        featuredImage {
          node {
            sourceUrl
            altText
            title
          }
        }
        courseFields {
          duration
          level
          price
          originalPrice
          instructor
          benefits
        }
        seo {
          title
          metaDesc
          canonical
          opengraphTitle
          opengraphDescription
          opengraphImage {
            sourceUrl
          }
        }
      }
    }
  `;

  try {
    const data = await fetchGraphQL<{ course?: WPCourse }>(query, { slug });
    return data?.course || null;
  } catch (error) {
    console.warn(`Lỗi lấy chi tiết course [${slug}]:`, error);
    return null;
  }
}

/**
 * Lấy danh sách bài viết Blog qua GraphQL
 */
export async function getWpPosts(first = 20): Promise<WPPost[]> {
  const query = `
    query GetPosts($first: Int!) {
      posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          databaseId
          title
          slug
          excerpt
          content
          date
          modified
          featuredImage {
            node {
              sourceUrl
              altText
              title
            }
          }
          author {
            node {
              name
              avatar {
                url
              }
            }
          }
          categories {
            nodes {
              id
              name
              slug
            }
          }
          tags {
            nodes {
              id
              name
              slug
            }
          }
        }
      }
    }
  `;

  try {
    const data = await fetchGraphQL<{ posts?: { nodes: WPPost[] } }>(query, { first });
    return data?.posts?.nodes || [];
  } catch (error) {
    console.warn('Không thể lấy bài viết qua GraphQL, thử fallback REST:', error);
    return await getRestPosts({ per_page: first });
  }
}

/**
 * Lấy chi tiết bài viết theo Slug qua GraphQL
 */
export async function getWpPostBySlug(slug: string): Promise<WPPost | null> {
  const query = `
    query GetPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        databaseId
        title
        slug
        excerpt
        content
        date
        modified
        featuredImage {
          node {
            sourceUrl
            altText
            title
          }
        }
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
        categories {
          nodes {
            id
            name
            slug
          }
        }
        tags {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
  `;

  try {
    const data = await fetchGraphQL<{ post?: WPPost }>(query, { slug });
    if (data?.post) return data.post;
  } catch (error) {
    console.warn(`Lỗi lấy bài viết [${slug}] qua GraphQL:`, error);
  }

  // Fallback REST nếu GraphQL không tìm thấy
  try {
    const restPosts = await getRestPosts({ slug });
    return restPosts && restPosts.length > 0 ? restPosts[0] : null;
  } catch {
    return null;
  }
}

/**
 * Lấy nội dung trang tĩnh (Page) theo Slug
 */
export async function getWpPageBySlug(slug: string): Promise<WPPage | null> {
  const query = `
    query GetPageBySlug($slug: ID!) {
      page(id: $slug, idType: URI) {
        id
        databaseId
        title
        slug
        content
        date
        modified
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        seo {
          title
          metaDesc
          canonical
        }
      }
    }
  `;

  try {
    const data = await fetchGraphQL<{ page?: WPPage }>(query, { slug });
    return data?.page || null;
  } catch (error) {
    console.warn(`Lỗi lấy trang [${slug}]:`, error);
    return null;
  }
}

/**
 * Lấy cấu hình chung trang web (Site Settings / Options)
 */
export async function getWpSiteSettings(): Promise<WPSiteSettings> {
  const query = `
    query GetSiteSettings {
      generalSettings {
        title
        description
      }
    }
  `;

  try {
    const data = await fetchGraphQL<{
      generalSettings?: {
        title?: string;
        description?: string;
      };
    }>(query);

    return {
      title: data?.generalSettings?.title || '',
      description: data?.generalSettings?.description || '',
    };
  } catch {
    return {
      title: '',
      description: '',
    };
  }
}

/**
 * Lấy Menu điều hướng từ WordPress
 */
export async function getWpMenu(location = 'PRIMARY'): Promise<WPMenuItem[]> {
  const query = `
    query GetMenu($location: MenuLocationEnum!) {
      menuItems(where: { location: $location }) {
        nodes {
          id
          label
          path
          url
          parentId
        }
      }
    }
  `;

  try {
    const data = await fetchGraphQL<{ menuItems?: { nodes: WPMenuItem[] } }>(query, { location });
    return data?.menuItems?.nodes || [];
  } catch (error) {
    console.warn(`Lỗi lấy menu [${location}]:`, error);
    return [];
  }
}

/**
 * Fallback REST API: Lấy bài viết khi GraphQL không khả dụng
 */
export async function getRestPosts(params: Record<string, any> = {}): Promise<WPPost[]> {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/posts?_embed${queryString ? `&${queryString}` : ''}`;
  return (await fetchWpRest<WPPost[]>(endpoint)) || [];
}

/**
 * Fallback REST API: Lấy Custom Post Type bất kỳ
 */
export async function getRestCustomPostType<T = any>(
  postType: string,
  params: Record<string, any> = {}
): Promise<T[]> {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/${postType}?${queryString}`;
  return (await fetchWpRest<T[]>(endpoint)) || [];
}

/**
 * Lấy danh mục bài viết Blog qua GraphQL
 */
export async function getWpBlogCategories(): Promise<Array<{ id: string; name: string; slug: string; count?: number }>> {
  const query = `
    query GetBlogCategories {
      categories(where: { hideEmpty: true }) {
        nodes {
          id
          name
          slug
          count
        }
      }
    }
  `;

  try {
    const data = await fetchGraphQL<{ categories?: { nodes: Array<{ id: string; name: string; slug: string; count?: number }> } }>(query);
    return data?.categories?.nodes || [];
  } catch (error) {
    console.warn('Lỗi lấy danh mục blog qua GraphQL:', error);
    return [];
  }
}

/**
 * Lấy danh sách sản phẩm (WooCommerce REST & Store API)
 */
export async function getWpProducts(perPage = 50): Promise<WPProduct[]> {
  try {
    const storeProducts = await fetchWpRest<any[]>(`/wp-json/wc/store/v1/products?per_page=${perPage}`);
    if (Array.isArray(storeProducts) && storeProducts.length > 0) {
      return storeProducts.map((item) => ({
        id: String(item.id),
        databaseId: item.id,
        name: item.name ? item.name.replace(/&#038;/g, '&').replace(/&amp;/g, '&') : '',
        slug: item.slug,
        description: item.description,
        shortDescription: item.short_description,
        price: item.prices?.price ? `$ ${(Number(item.prices.price) / 1).toFixed(2)}` : '$ 0.00',
        regularPrice: item.prices?.regular_price ? `$ ${(Number(item.prices.regular_price) / 1).toFixed(2)}` : '',
        salePrice: item.prices?.sale_price ? `$ ${(Number(item.prices.sale_price) / 1).toFixed(2)}` : '',
        onSale: item.prices?.regular_price !== item.prices?.sale_price,
        stock: item.is_in_stock ? (item.low_stock_amount || 26) : 0,
        image: {
          sourceUrl: item.images?.[0]?.src || '/images/anh-san-pham.png',
          altText: item.images?.[0]?.alt || item.name,
        },
        galleryImages: {
          nodes: (item.images || []).map((img: any) => ({
            sourceUrl: img.src,
            altText: img.alt || item.name,
          })),
        },
        categories: (item.categories || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
        })),
      }));
    }
  } catch (error) {
    console.warn('Lỗi lấy products qua WC Store API:', error);
  }

  return [];
}

/**
 * Lấy chi tiết sản phẩm theo Slug
 */
export async function getWpProductBySlug(slug: string): Promise<WPProduct | null> {
  const products = await getWpProducts(100);
  const found = products.find((p) => p.slug === slug);
  return found || null;
}
