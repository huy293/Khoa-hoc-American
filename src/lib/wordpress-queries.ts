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
 * Lấy danh sách bài viết Blog
 */
export async function getWpPosts(first = 10): Promise<WPPost[]> {
  const query = `
    query GetPosts($first: Int!) {
      posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          databaseId
          title
          slug
          excerpt
          date
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              id
              name
              slug
            }
          }
          seo {
            title
            metaDesc
            canonical
          }
        }
      }
    }
  `;

  try {
    const data = await fetchGraphQL<{ posts?: { nodes: WPPost[] } }>(query, { first });
    return data?.posts?.nodes || [];
  } catch (error) {
    console.warn('Không thể lấy bài viết qua GraphQL:', error);
    return [];
  }
}

/**
 * Lấy chi tiết bài viết theo Slug
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
          }
        }
        categories {
          nodes {
            id
            name
            slug
          }
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
    const data = await fetchGraphQL<{ post?: WPPost }>(query, { slug });
    return data?.post || null;
  } catch (error) {
    console.warn(`Lỗi lấy bài viết [${slug}]:`, error);
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
