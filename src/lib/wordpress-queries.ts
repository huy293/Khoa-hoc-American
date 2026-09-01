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
 * Lấy danh sách khóa học (Custom Post Type 'course' hoặc 'courses' hoặc 'lp_course')
 */
export async function getWpCourses(first = 20): Promise<WPCourse[]> {
  try {
    const endpoints = ['/wp-json/wp/v2/course', '/wp-json/wp/v2/courses', '/wp-json/wp/v2/lp_course'];
    for (const ep of endpoints) {
      try {
        const courses = await fetchWpRest<any[]>(`${ep}?per_page=${first}&_embed=1`);
        if (Array.isArray(courses) && courses.length > 0) {
          return courses.map((c) => {
            const scf = c.acf || c.scf || {};
            const featuredImg = c._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
            return {
              id: String(c.id),
              databaseId: c.id,
              title: c.title?.rendered || '',
              slug: c.slug,
              excerpt: c.excerpt?.rendered || '',
              content: c.content?.rendered || '',
              date: c.date,
              modified: c.modified,
              featuredImage: featuredImg ? { node: { sourceUrl: featuredImg } } : undefined,
              courseFields: {
                ...scf,
                price: scf.price || c.price || '$ 1,200',
                duration: scf.duration || c.duration || '4 Weeks',
                instructor: scf.instructor || 'Master Trainer',
              },
            };
          });
        }
      } catch {
        // Thử endpoint tiếp theo
      }
    }
  } catch {
    // Không làm sập build
  }

  return [];
}

/**
 * Lấy chi tiết khóa học theo Slug
 */
export async function getWpCourseBySlug(slug: string): Promise<WPCourse | null> {
  const cleanSlug = slug.replace(/^\/+|\/+$/g, '');
  try {
    const endpoints = ['/wp-json/wp/v2/course', '/wp-json/wp/v2/courses', '/wp-json/wp/v2/lp_course'];
    for (const ep of endpoints) {
      try {
        const courses = await fetchWpRest<any[]>(`${ep}?slug=${cleanSlug}&_embed=1`);
        if (Array.isArray(courses) && courses.length > 0) {
          const c = courses[0];
          const scf = c.acf || c.scf || {};
          const featuredImg = c._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
          return {
            id: String(c.id),
            databaseId: c.id,
            title: c.title?.rendered || '',
            slug: c.slug,
            excerpt: c.excerpt?.rendered || '',
            content: c.content?.rendered || '',
            date: c.date,
            modified: c.modified,
            featuredImage: featuredImg ? { node: { sourceUrl: featuredImg } } : undefined,
            courseFields: {
              ...scf,
              price: scf.price || c.price || '$ 1,200',
              duration: scf.duration || c.duration || '4 Weeks',
              instructor: scf.instructor || 'Master Trainer',
            },
          };
        }
      } catch {}
    }
  } catch {
    return null;
  }

  return null;
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
export async function getWpPageBySlug<T = any>(slug: string): Promise<WPPage<T> | null> {
  const cleanSlug = slug.replace(/^\/+|\/+$/g, '');
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
      }
    }
  `;

  let pageData: WPPage<T> | null = null;

  try {
    const data = await fetchGraphQL<{ page?: WPPage<T> }>(query, { slug: cleanSlug });
    if (data?.page) {
      pageData = data.page;
    }
  } catch (error) {
    console.warn(`Lỗi lấy trang [${slug}] qua GraphQL:`, error);
  }

  // Nạp thêm trường SCF / ACF từ REST API nếu có
  try {
    const restPages = await fetchWpRest<any[]>(`/wp-json/wp/v2/pages?slug=${cleanSlug}`);
    if (Array.isArray(restPages) && restPages.length > 0) {
      const restPage = restPages[0];
      const scfData = (restPage.acf || restPage.scf || {}) as T;
      if (pageData) {
        pageData.scf = scfData;
        pageData.acf = scfData;
      } else {
        pageData = {
          id: String(restPage.id),
          databaseId: restPage.id,
          title: restPage.title?.rendered || '',
          slug: restPage.slug,
          content: restPage.content?.rendered || '',
          scf: scfData,
          acf: scfData,
        };
      }
    }
  } catch {
    // Bỏ qua lỗi REST để không làm chậm
  }

  return pageData;
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
        url
      }
    }
  `;

  let settings: WPSiteSettings = {
    title: 'Couture Beauty Academy',
    description: 'Professional Beauty & Aesthetic Training in Houston',
    hotline: '+1 (713) 555-0199',
    phone: '+1 (713) 555-0199',
    email: 'admissions@couturebeauty.edu',
    address: '9889 Bellaire Blvd, Suite 218, Houston, TX 77036',
    facebookUrl: 'https://facebook.com/couturebeautyacademy',
    instagramUrl: 'https://instagram.com/couturebeautyacademy',
    tiktokUrl: 'https://tiktok.com/@couturebeautyacademy',
    copyrightText: '© 2026 Couture Beauty Academy. All rights reserved.',
  };

  try {
    const data = await fetchGraphQL<{
      generalSettings?: {
        title?: string;
        description?: string;
        url?: string;
      };
    }>(query);

    if (data?.generalSettings) {
      if (data.generalSettings.title) settings.title = data.generalSettings.title;
      if (data.generalSettings.description) settings.description = data.generalSettings.description;
    }
  } catch (err) {
    console.warn('Lỗi lấy Site Settings qua GraphQL:', err);
  }

  return settings;
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
