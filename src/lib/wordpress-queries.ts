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
 * Helper: Parse dữ liệu từ WordPress/LearnPress (lp_course) thành đối tượng chuẩn WPCourse
 */
function parseWpCourse(c: any): WPCourse {
  const scf = (c.acf || c.scf || {}) as any;
  const featuredImg =
    c._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    c.featured_image_url ||
    c.image ||
    c.featured_media_url ||
    (typeof scf.featured_image === 'string' ? scf.featured_image : scf.featured_image?.sourceUrl) ||
    '';

  // Lấy Category từ taxonomy course_category hoặc lp_course_category của LearnPress
  const terms: any[] = c._embedded?.['wp:term'] ? c._embedded['wp:term'].flat() : [];
  const catTerm = terms.find((t: any) =>
    t.taxonomy === 'course_category' ||
    t.taxonomy === 'lp_course_category' ||
    t.taxonomy === 'category'
  );
  const tagTerm = terms.find((t: any) =>
    t.taxonomy === 'course_tag' ||
    t.taxonomy === 'lp_course_tag' ||
    t.taxonomy === 'post_tag'
  );

  const categoryName =
    scf.category ||
    catTerm?.name ||
    (Array.isArray(c.categories) && c.categories.length > 0 ? (typeof c.categories[0] === 'string' ? c.categories[0] : c.categories[0]?.name) : '') ||
    'CERTIFICATE TRAINING';

  const tagName =
    scf.tag ||
    tagTerm?.name ||
    catTerm?.name ||
    'Facial class';

  // Lấy Author / Giảng viên
  const author = c._embedded?.author?.[0];
  const trainerName =
    scf.trainer?.name ||
    scf.instructor ||
    author?.name ||
    c.instructor?.name ||
    'Kathleen trainer';
  const trainerAvatar =
    scf.trainer?.avatar ||
    author?.avatar_urls?.['96'] ||
    author?.avatar_urls?.['48'] ||
    author?.avatar_urls?.['24'] ||
    c.instructor?.avatar ||
    '/images/home/kathleen.png';
  const trainerRating = scf.trainer?.rating || scf.rating || '4.9/5.0';

  // Xử lý giá tiền (LearnPress meta: _lp_price, _lp_regular_price)
  let rawPrice = scf.price;
  if (!rawPrice && c.meta?._lp_price !== undefined && c.meta?._lp_price !== '') {
    rawPrice = `$ ${c.meta._lp_price}`;
  } else if (!rawPrice && c.price_rendered) {
    rawPrice = c.price_rendered.replace(/<[^>]*>/g, '').trim();
  } else if (!rawPrice && c.price !== undefined && c.price !== '') {
    rawPrice = typeof c.price === 'number' ? `$ ${c.price.toLocaleString()}` : String(c.price);
  }
  if (!rawPrice) rawPrice = '$ 1,200';

  // Thời lượng & cấp độ
  const duration = scf.duration || c.meta?._lp_duration || c.duration || '4 Weeks';
  const level = scf.level || c.meta?._lp_level || c.level || 'All Levels';

  // Số lượng học viên
  const traineeCount =
    scf.traineeCount ||
    scf.trainee_count ||
    (c.meta?._lp_students ? `(${c.meta._lp_students}+ trainee)` : (c.count_students ? `(${c.count_students}+ trainee)` : '(2.700+ trainee)'));

  // Module Sections & Giáo trình (Curriculum)
  const sections = Array.isArray(c.sections) ? c.sections : [];

  let totalLessonsCount = 0;
  let totalQuizzesCount = 0;
  if (sections.length > 0) {
    sections.forEach((sec: any) => {
      if (Array.isArray(sec.items)) {
        sec.items.forEach((it: any) => {
          if (it.type === 'lp_quiz') totalQuizzesCount++;
          else totalLessonsCount++;
        });
      }
    });
  }

  // Số bài học & bài kiểm tra
  const lessons =
    scf.lessons ||
    (totalLessonsCount > 0
      ? `${totalLessonsCount} lessons`
      : (c.meta?._lp_lesson_count
        ? `${c.meta._lp_lesson_count} lessons`
        : (c.count_items?.lesson
          ? `${c.count_items.lesson} lessons`
          : '12 lessons')));

  const quizzes =
    scf.quizzes ||
    (totalQuizzesCount > 0
      ? `${totalQuizzesCount} quizzes`
      : (c.count_items?.quiz
        ? `${c.count_items.quiz} quizzes`
        : '3 quizzes'));

  const moduleCount =
    scf.module ||
    (sections.length > 0
      ? `${sections.length} modules`
      : (Array.isArray(scf.curriculum)
        ? `${scf.curriculum.length} modules`
        : '4 modules'));

  // Giáo trình (Curriculum)
  let curriculum = scf.curriculum;
  if (!curriculum && sections.length > 0) {
    curriculum = sections.map((sec: any) => ({
      id: sec.id,
      title: sec.title || sec.name || 'Module',
      lessons: Array.isArray(sec.items)
        ? sec.items.map((it: any) => it.title || it.name || '')
        : [],
      items: sec.items || [],
    }));
  }

  const cleanTitle = (c.title?.rendered || c.name || c.title || '')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '-')
    .replace(/&#8217;/g, "'");

  const cleanExcerpt = (c.excerpt?.rendered || c.short_description || c.excerpt || '')
    .replace(/<[^>]*>/g, '')
    .trim();

  return {
    id: String(c.id),
    databaseId: c.id,
    title: cleanTitle,
    slug: c.slug,
    excerpt: cleanExcerpt,
    content: c.content?.rendered || c.description || c.content || '',
    date: c.date,
    modified: c.modified,
    featuredImage: featuredImg ? { node: { sourceUrl: featuredImg } } : undefined,
    sections,
    courseFields: {
      ...scf,
      category: categoryName,
      tag: tagName,
      price: rawPrice,
      originalPrice: scf.originalPrice || c.meta?._lp_regular_price || c.origin_price_rendered || '',
      duration,
      level,
      lessons,
      quizzes,
      module: moduleCount,
      rating: scf.rating || (c.rating ? `${c.rating}/5.0` : '4.9/5.0'),
      traineeCount,
      subtitle: scf.subtitle || cleanExcerpt,
      trainer: {
        name: trainerName,
        avatar: trainerAvatar,
        rating: trainerRating,
      },
      sections,
      curriculum,
      benefits: scf.benefits || [],
      about_img_left: scf.about_img_left,
      about_img_center: scf.about_img_center,
      about_img_right: scf.about_img_right,
    },
    seo: c.yoast_head_json || c.rank_math_seo || c.seo,
  };
}

/**
 * Lấy danh sách khóa học LearnPress (post_type: 'lp_course') hoặc CPT 'courses' / 'course'
 */
export async function getWpCourses(first = 20): Promise<WPCourse[]> {
  // 1. Thử GraphQL query cho lpCourses
  const gqlQuery = `
    query GetLpCourses($first: Int!) {
      lpCourses(first: $first) {
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
        }
      }
    }
  `;

  try {
    const gqlData = await fetchGraphQL<{ lpCourses?: { nodes: any[] } }>(gqlQuery, { first });
    if (gqlData?.lpCourses?.nodes && gqlData.lpCourses.nodes.length > 0) {
      return gqlData.lpCourses.nodes.map(parseWpCourse);
    }
  } catch {
    // Chuyển sang REST API fallback
  }

  // 2. Thử REST API endpoints của LearnPress và WordPress CPT
  const endpoints = [
    `/wp-json/learnpress/v1/courses?per_page=${first}`,
    `/wp-json/wp/v2/lp_course?per_page=${first}&_embed=1`,
    `/wp-json/lp/v1/courses/archive-course`,
    `/wp-json/lp/v1/courses?per_page=${first}`,
    `/wp-json/wp/v2/courses?per_page=${first}&_embed=1`,
    `/wp-json/wp/v2/course?per_page=${first}&_embed=1`,
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetchWpRest<any>(ep);
      const rawCourses = Array.isArray(res)
        ? res
        : (Array.isArray(res?.data)
          ? res.data
          : (Array.isArray(res?.courses) ? res.courses : []));

      if (Array.isArray(rawCourses) && rawCourses.length > 0) {
        // Làm giàu dữ liệu chi tiết cho từng khóa học (lấy sections từ /wp-json/learnpress/v1/courses/{id})
        const enrichedCourses = await Promise.all(
          rawCourses.map(async (c: any) => {
            if (c.sections && Array.isArray(c.sections) && c.sections.length > 0) {
              return c;
            }
            if (c.id) {
              try {
                const detail = await fetchWpRest<any>(`/wp-json/learnpress/v1/courses/${c.id}`);
                if (detail && typeof detail === 'object') {
                  return { ...c, ...detail };
                }
              } catch {
                // Tiếp tục với dữ liệu hiện có nếu fetch detail thất bại
              }
            }
            return c;
          })
        );

        return enrichedCourses.map(parseWpCourse);
      }
    } catch {
      // Thử endpoint tiếp theo
    }
  }

  return [];
}

/**
 * Lấy chi tiết khóa học theo Slug (post_type: 'lp_course')
 */
export async function getWpCourseBySlug(slug: string): Promise<WPCourse | null> {
  const cleanSlug = slug.replace(/^\/+|\/+$/g, '');

  // 1. Thử GraphQL query
  const gqlQuery = `
    query GetLpCourseBySlug($slug: ID!) {
      lpCourse(id: $slug, idType: SLUG) {
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
      }
    }
  `;

  try {
    const gqlData = await fetchGraphQL<{ lpCourse?: any }>(gqlQuery, { slug: cleanSlug });
    if (gqlData?.lpCourse) {
      const course = parseWpCourse(gqlData.lpCourse);
      // Nếu chưa có sections, thử lấy từ LearnPress REST
      if (!course.sections || course.sections.length === 0) {
        try {
          const detail = await fetchWpRest<any>(`/wp-json/learnpress/v1/courses/${course.databaseId || cleanSlug}`);
          if (detail && detail.sections) {
            return parseWpCourse({ ...gqlData.lpCourse, ...detail });
          }
        } catch {
          // ignore
        }
      }
      return course;
    }
  } catch {
    // Chuyển sang REST fallback
  }

  // 2. Thử REST API endpoints
  const endpoints = [
    `/wp-json/learnpress/v1/courses/${cleanSlug}`,
    `/wp-json/wp/v2/lp_course?slug=${cleanSlug}&_embed=1`,
    `/wp-json/lp/v1/courses/${cleanSlug}`,
    `/wp-json/wp/v2/courses?slug=${cleanSlug}&_embed=1`,
    `/wp-json/wp/v2/course?slug=${cleanSlug}&_embed=1`,
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetchWpRest<any>(ep);
      let courseRaw: any = null;
      if (Array.isArray(res) && res.length > 0) {
        courseRaw = res[0];
      } else if (res && typeof res === 'object' && res.id) {
        courseRaw = res;
      }

      if (courseRaw) {
        if ((!courseRaw.sections || courseRaw.sections.length === 0) && courseRaw.id) {
          try {
            const detail = await fetchWpRest<any>(`/wp-json/learnpress/v1/courses/${courseRaw.id}`);
            if (detail && detail.sections) {
              courseRaw = { ...courseRaw, ...detail };
            }
          } catch {
            // ignore
          }
        }
        return parseWpCourse(courseRaw);
      }
    } catch {
      // Thử endpoint tiếp theo
    }
  }

  // 3. Fallback: Lấy tất cả courses và tìm theo slug
  try {
    const allCourses = await getWpCourses(50);
    const found = allCourses.find((c) => c.slug === cleanSlug);
    if (found) return found;
  } catch {
    // ignore
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
      return storeProducts.map((item) => {
        const regularNum = Number(item.prices?.regular_price);
        const saleNum = Number(item.prices?.sale_price || item.prices?.price);
        const priceNum = Number(item.prices?.price);
        const isOnSale = Boolean(item.on_sale) || (regularNum > 0 && priceNum > 0 && regularNum > priceNum);

        return {
          id: String(item.id),
          databaseId: item.id,
          name: item.name ? item.name.replace(/&#038;/g, '&').replace(/&amp;/g, '&') : '',
          slug: item.slug,
          description: item.description,
          shortDescription: item.short_description,
          price: priceNum > 0 ? `$ ${priceNum.toFixed(2)}` : '$ 0.00',
          regularPrice: isOnSale && regularNum > 0 ? `$ ${regularNum.toFixed(2)}` : '',
          salePrice: isOnSale && saleNum > 0 ? `$ ${saleNum.toFixed(2)}` : '',
          onSale: isOnSale,
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
        };
      });
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
