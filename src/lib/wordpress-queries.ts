import {
  WPCourse,
  WPLesson,
  WPPost,
  WPPage,
  WPProduct,
  WPSiteSettings,
  WPMenuItem,
} from '@/types/wordpress';
import { fetchGraphQL, fetchWpRest } from './wordpress';
import { toSlug } from './wordpress-format';

function parseWpCourse(c: any): WPCourse {
  if (c && c.courseFields && typeof c.courseFields === 'object' && c.title && c.slug) {
    return {
      id: String(c.id),
      databaseId: Number(c.databaseId || c.id),
      title: c.title,
      slug: c.slug,
      excerpt: c.excerpt || '',
      content: c.content || '',
      featuredImage: c.featuredImage || (c.image ? { node: { sourceUrl: c.image } } : undefined),
      categories: c.categories || [],
      course_category: c.course_category || [],
      sections: c.sections || [],
      courseFields: {
        duration: c.courseFields.duration || '10 weeks',
        level: c.courseFields.level || 'All levels',
        price: c.courseFields.price ?? 0,
        originalPrice: c.courseFields.originalPrice ?? 0,
        instructor: c.courseFields.instructor || 'Admin',
        lessons: c.courseFields.lessons || 0,
        curriculum: c.courseFields.curriculum || [],
        categories: c.courseFields.categories || c.categories || [],
        trainer: c.courseFields.trainer || {
          name: c.courseFields.instructor || 'Admin',
          avatar: '/images/kathleen.png',
          rating: '5.0',
        },
        ...c.courseFields,
      },
      seo: c.seo || null,
    };
  }

  const scf = (c.acf || c.scf || {}) as any;
  const featuredImg =
    c._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    c.featured_image_url ||
    c.image ||
    c.featured_media_url ||
    (typeof scf.featured_image === 'string' ? scf.featured_image : scf.featured_image?.sourceUrl) ||
    '';

  // Lấy Category chính xác từ taxonomy course_category của LearnPress / WordPress
  const terms: any[] = c._embedded?.['wp:term'] ? c._embedded['wp:term'].flat() : [];
  const courseCategories: Array<{ id: number; name: string; slug: string; taxonomy: string }> = [];

  terms.forEach((t: any) => {
    if (t && (t.taxonomy === 'course_category' || t.taxonomy === 'lp_course_category')) {
      courseCategories.push({
        id: Number(t.id),
        name: typeof t.name === 'string' ? t.name.trim() : '',
        slug: typeof t.slug === 'string' ? t.slug.trim() : '',
        taxonomy: t.taxonomy,
      });
    }
  });

  if (courseCategories.length === 0) {
    const rawCats = Array.isArray(c.categories) ? c.categories : (Array.isArray(scf.categories) ? scf.categories : []);
    rawCats.forEach((cat: any) => {
      if (typeof cat === 'string' && cat.trim()) {
        courseCategories.push({
          id: 0,
          name: cat.trim(),
          slug: toSlug(cat.trim()),
          taxonomy: 'course_category',
        });
      } else if (cat && typeof cat === 'object') {
        const catName = typeof cat.name === 'string' ? cat.name.trim() : '';
        if (catName) {
          courseCategories.push({
            id: Number(cat.id || 0),
            name: catName,
            slug: typeof cat.slug === 'string' && cat.slug.trim() ? cat.slug.trim() : toSlug(catName),
            taxonomy: 'course_category',
          });
        }
      }
    });

    if (courseCategories.length === 0) {
      const singleCat = (typeof scf.category === 'string' && scf.category.trim())
        ? scf.category.trim()
        : (typeof c.category === 'string' && c.category.trim() ? c.category.trim() : '');
      if (singleCat) {
        courseCategories.push({
          id: 0,
          name: singleCat,
          slug: toSlug(singleCat),
          taxonomy: 'course_category',
        });
      }
    }
  }

  const catTerm = courseCategories[0];
  const tagTerm = terms.find((t: any) =>
    t.taxonomy === 'course_tag' ||
    t.taxonomy === 'lp_course_tag' ||
    t.taxonomy === 'post_tag'
  );

  const categoryName =
    catTerm?.name ||
    scf.category ||
    (Array.isArray(c.categories) && c.categories.length > 0 ? (typeof c.categories[0] === 'string' ? c.categories[0] : c.categories[0]?.name) : '') ||
    '';

  const tagName =
    scf.tag ||
    tagTerm?.name ||
    catTerm?.name ||
    '';

  // Lấy Author / Giảng viên
  const author = c._embedded?.author?.[0];
  const trainerName =
    scf.trainer?.name ||
    scf.instructor ||
    (author?.name && author.name !== 'admin' ? author.name : '') ||
    c.instructor?.name ||
    '';
  const trainerAvatar =
    scf.trainer?.avatar ||
    author?.avatar_urls?.['96'] ||
    author?.avatar_urls?.['48'] ||
    author?.avatar_urls?.['24'] ||
    c.instructor?.avatar ||
    '';
  const trainerRating = scf.trainer?.rating || scf.rating || '';

  // Xử lý giá tiền (LearnPress meta: _lp_price, _lp_regular_price)
  let rawPrice = scf.price;
  if (!rawPrice && c.meta?._lp_price !== undefined && c.meta?._lp_price !== '') {
    rawPrice = `$ ${c.meta._lp_price}`;
  } else if (!rawPrice && c.price_rendered) {
    rawPrice = c.price_rendered.replace(/<[^>]*>/g, '').trim();
  } else if (!rawPrice && c.price !== undefined && c.price !== '') {
    rawPrice = typeof c.price === 'number' ? `$ ${c.price.toLocaleString()}` : String(c.price);
  }
  rawPrice = rawPrice || '';

  // Thời lượng & cấp độ
  const duration = scf.duration || c.meta?._lp_duration || c.duration || '';
  const level = scf.level || c.meta?._lp_level || c.level || '';

  // Số lượng học viên
  const traineeCount =
    scf.traineeCount ||
    scf.trainee_count ||
    (c.meta?._lp_students ? `(${c.meta._lp_students}+ trainee)` : (c.count_students ? `(${c.count_students}+ trainee)` : ''));

  // Module Sections & Giáo trình (Curriculum)
  const rawSections = Array.isArray(c.sections) ? c.sections : [];

  const sections = rawSections.map((sec: any, sIdx: number) => {
    const secTitle = (sec.title || sec.name || `Module ${sIdx + 1}`)
      .replace(/&#038;/g, '&')
      .replace(/&amp;/g, '&')
      .replace(/&#8211;/g, '-')
      .replace(/&#8217;/g, "'");

    const items = Array.isArray(sec.items)
      ? sec.items.map((it: any, lIdx: number) => {
          const itemTitle = (it.title?.rendered || it.title || it.name || `Lesson ${lIdx + 1}`)
            .replace(/&#038;/g, '&')
            .replace(/&amp;/g, '&')
            .replace(/&#8211;/g, '-')
            .replace(/&#8217;/g, "'");

          const itemSlug = it.slug || toSlug(itemTitle) || String(it.id || lIdx + 1);
          const lessonVideos =
            it.lesson_videos ||
            it.acf?.lesson_videos ||
            it.scf?.lesson_videos ||
            it.meta?.lesson_videos ||
            it.video_url ||
            it.meta?._lp_lesson_video_intro;

          return {
            ...it,
            id: it.id,
            title: itemTitle,
            slug: itemSlug,
            type: it.type || 'lp_lesson',
            duration: (typeof it.duration === 'string' && it.duration) ? it.duration : '',
            lesson_videos: lessonVideos,
            video_url: lessonVideos || it.video_url,
            acf: it.acf || (lessonVideos ? { lesson_videos: lessonVideos } : undefined),
          };
        })
      : [];

    return {
      ...sec,
      id: sec.id || sIdx + 1,
      title: secTitle,
      name: secTitle,
      items,
    };
  });

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
          : '')));

  const quizzes =
    scf.quizzes ||
    (totalQuizzesCount > 0
      ? `${totalQuizzesCount} quizzes`
      : (c.count_items?.quiz
        ? `${c.count_items.quiz} quizzes`
        : ''));

  const moduleCount =
    scf.module ||
    (sections.length > 0
      ? `${sections.length} modules`
      : (Array.isArray(scf.curriculum) && scf.curriculum.length > 0
        ? `${scf.curriculum.length} modules`
        : ''));

  // Giáo trình (Curriculum)
  let curriculum = scf.curriculum;
  if (!curriculum && sections.length > 0) {
    curriculum = sections.map((sec: any) => ({
      id: sec.id,
      title: sec.title || sec.name || '',
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
    categories: courseCategories,
    course_category: Array.isArray(c.course_category) ? c.course_category : courseCategories.map(cat => cat.id),
    sections,
    courseFields: {
      ...scf,
      category: categoryName,
      categories: courseCategories,
      tag: tagName,
      price: rawPrice,
      originalPrice: scf.originalPrice || c.meta?._lp_regular_price || c.origin_price_rendered || '',
      duration,
      level,
      lessons,
      quizzes,
      module: moduleCount,
      rating: scf.rating || (c.rating ? `${c.rating}/5.0` : ''),
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
  // 1. Thử REST API endpoints của LearnPress và WordPress CPT (Ưu tiên REST vì LearnPress chuẩn REST)
  const endpoints = [
    `/wp-json/homenest/v1/courses?per_page=${first}`,
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
        // Làm giàu dữ liệu chi tiết cho từng khóa học (lấy 4 sections từ /wp-json/learnpress/v1/courses/{id})
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

export interface WPCourseCategoryItem {
  id: number;
  name: string;
  slug: string;
  count?: number;
  description?: string;
  taxonomy?: string;
}

/**
 * Lấy danh sách danh mục khóa học (taxonomy: 'course_category' hoặc 'lp_course_category')
 */
export async function getWpCourseCategories(): Promise<WPCourseCategoryItem[]> {
  const endpoints = [
    '/wp-json/wp/v2/course_category?per_page=100',
    '/wp-json/wp/v2/lp_course_category?per_page=100',
    '/wp-json/learnpress/v1/courses/category',
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetchWpRest<any>(ep);
      const rawCats = Array.isArray(res)
        ? res
        : (Array.isArray(res?.data) ? res.data : []);
      if (Array.isArray(rawCats) && rawCats.length > 0) {
        return rawCats
          .map((item: any) => ({
            id: Number(item.id || 0),
            name: typeof item.name === 'string'
              ? item.name.replace(/&#038;/g, '&').replace(/&amp;/g, '&').replace(/&#8211;/g, '-').replace(/&#8217;/g, "'").trim()
              : '',
            slug: typeof item.slug === 'string' ? item.slug.trim() : '',
            count: typeof item.count === 'number' ? item.count : undefined,
            description: typeof item.description === 'string' ? item.description : undefined,
            taxonomy: item.taxonomy || 'course_category',
          }))
          .filter((cat) => Boolean(cat.name));
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

  // 1. Thử REST API endpoints
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

  // 2. Fallback: Lấy tất cả courses và tìm theo slug
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
 * Lấy chi tiết bài học (post_type: 'lp_lesson') của LearnPress theo slug/id
 */
export async function getWpLessonBySlug(
  slug: string,
  course?: WPCourse | null
): Promise<WPLesson | null> {
  const cleanSlug = slug.replace(/^\/+|\/+$/g, '');

  // 1. Tìm item từ course.sections nếu có
  let foundLessonItem: any = null;
  if (course && Array.isArray(course.sections)) {
    for (const sec of course.sections) {
      if (Array.isArray(sec.items)) {
        const found = sec.items.find(
          (it) =>
            String(it.id) === cleanSlug ||
            it.slug === cleanSlug ||
            toSlug(it.title || '') === cleanSlug ||
            (it.title && it.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanSlug)
        );
        if (found) {
          foundLessonItem = found;
          break;
        }
      }
    }
  }

  // Nếu trong section đã có sẵn lesson_videos đầy đủ thì có thể tạo fallback sẵn
  const lessonItemId = foundLessonItem?.id;

  // 2. Thử REST API endpoints của WordPress / LearnPress để lấy đầy đủ trường ACF (lesson_videos)
  const endpoints = [
    `/wp-json/homenest/v1/lesson/${cleanSlug}`,
    ...(lessonItemId ? [
      `/wp-json/homenest/v1/lesson/${lessonItemId}`,
      `/wp-json/wp/v2/lp_lesson/${lessonItemId}?_embed=1`,
      `/wp-json/learnpress/v1/lessons/${lessonItemId}`,
      `/wp-json/lp/v1/lessons/${lessonItemId}`,
    ] : []),
    `/wp-json/wp/v2/lp_lesson?slug=${cleanSlug}&_embed=1`,
    `/wp-json/wp/v2/lp_lesson/${cleanSlug}?_embed=1`,
    `/wp-json/learnpress/v1/lessons/${cleanSlug}`,
    `/wp-json/lp/v1/lessons/${cleanSlug}`,
    `/wp-json/wp/v2/lessons?slug=${cleanSlug}&_embed=1`,
    `/wp-json/wp/v2/lesson?slug=${cleanSlug}&_embed=1`,
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetchWpRest<any>(ep);
      let lessonRaw: any = null;
      if (Array.isArray(res) && res.length > 0) {
        lessonRaw = res[0];
      } else if (res && typeof res === 'object' && res.id) {
        lessonRaw = res;
      }

      if (lessonRaw) {
        const cleanTitle = (lessonRaw.title?.rendered || lessonRaw.name || lessonRaw.title || '')
          .replace(/&#038;/g, '&')
          .replace(/&amp;/g, '&')
          .replace(/&#8211;/g, '-')
          .replace(/&#8217;/g, "'");

        const cleanContent = lessonRaw.content?.rendered || lessonRaw.content || '';
        const cleanExcerpt = (lessonRaw.excerpt?.rendered || lessonRaw.excerpt || '')
          .replace(/<[^>]*>/g, '')
          .trim();

        const featuredImg =
          lessonRaw._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
          lessonRaw.featured_image_url ||
          lessonRaw.featured_media_url ||
          lessonRaw.image;

        const lessonVideos =
          lessonRaw.acf?.lesson_videos ||
          lessonRaw.acf?.lesson_video ||
          lessonRaw.scf?.lesson_videos ||
          lessonRaw.lesson_videos ||
          lessonRaw.meta?.lesson_videos ||
          lessonRaw.video_url ||
          lessonRaw.meta?._lp_lesson_video_intro ||
          foundLessonItem?.lesson_videos ||
          '';

        return {
          id: String(lessonRaw.id),
          databaseId: lessonRaw.id,
          title: cleanTitle || foundLessonItem?.title || 'Lesson',
          slug: lessonRaw.slug || foundLessonItem?.slug || cleanSlug,
          content: cleanContent || (typeof foundLessonItem?.content === 'string' ? foundLessonItem.content : ''),
          excerpt: cleanExcerpt,
          duration: lessonRaw.duration || foundLessonItem?.duration || '45 min',
          preview: lessonRaw.preview !== undefined ? lessonRaw.preview : foundLessonItem?.preview,
          locked: lessonRaw.locked !== undefined ? lessonRaw.locked : foundLessonItem?.locked,
          video_url: lessonVideos || lessonRaw.video_url || lessonRaw.meta?._lp_lesson_video_intro,
          lesson_videos: lessonVideos,
          acf: {
            ...lessonRaw.acf,
            lesson_videos: lessonVideos,
          },
          featuredImage: featuredImg ? { node: { sourceUrl: featuredImg } } : undefined,
          seo: lessonRaw.yoast_head_json || lessonRaw.rank_math_seo || lessonRaw.seo,
        };
      }
    } catch {
      // Thử endpoint tiếp theo
    }
  }

  // 3. Fallback: Nếu đã tìm thấy từ course.sections thì trả về
  if (foundLessonItem) {
    const lessonVideos =
      foundLessonItem.lesson_videos ||
      foundLessonItem.acf?.lesson_videos ||
      (foundLessonItem as any).meta?.lesson_videos ||
      foundLessonItem.video_url ||
      '';

    return {
      id: String(foundLessonItem.id || cleanSlug),
      databaseId: typeof foundLessonItem.id === 'number' ? foundLessonItem.id : undefined,
      title: foundLessonItem.title || 'Lesson',
      slug: foundLessonItem.slug || toSlug(foundLessonItem.title || '') || cleanSlug,
      duration: (typeof foundLessonItem.duration === 'string' && foundLessonItem.duration) ? foundLessonItem.duration : '45 min',
      preview: foundLessonItem.preview,
      locked: foundLessonItem.locked,
      content: (typeof foundLessonItem.content === 'string') ? foundLessonItem.content : '',
      video_url: lessonVideos || ((typeof foundLessonItem.video_url === 'string') ? foundLessonItem.video_url : undefined),
      lesson_videos: lessonVideos,
      acf: foundLessonItem.acf || (lessonVideos ? { lesson_videos: lessonVideos } : undefined),
    };
  }

  // 4. Fallback: Tìm qua tất cả các khóa học khác
  try {
    const allCourses = await getWpCourses(50);
    for (const c of allCourses) {
      if (Array.isArray(c.sections)) {
        for (const sec of c.sections) {
          if (Array.isArray(sec.items)) {
            const found = sec.items.find(
              (it) =>
                String(it.id) === cleanSlug ||
                it.slug === cleanSlug ||
                toSlug(it.title || '') === cleanSlug ||
                (it.title && it.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanSlug)
            );
            if (found) {
              const lessonVideos =
                found.lesson_videos ||
                found.acf?.lesson_videos ||
                (found as any).meta?.lesson_videos ||
                found.video_url ||
                '';

              return {
                id: String(found.id || cleanSlug),
                databaseId: typeof found.id === 'number' ? found.id : undefined,
                title: found.title || 'Lesson',
                slug: found.slug || toSlug(found.title || '') || cleanSlug,
                duration: (typeof found.duration === 'string' && found.duration) ? found.duration : '45 min',
                preview: found.preview,
                locked: found.locked,
                content: (typeof found.content === 'string') ? found.content : '',
                video_url: lessonVideos || ((typeof found.video_url === 'string') ? found.video_url : undefined),
                lesson_videos: lessonVideos,
                acf: found.acf || (lessonVideos ? { lesson_videos: lessonVideos } : undefined),
              };
            }
          }
        }
      }
    }
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
      const seoData = restPage.rank_math_seo || restPage.yoast_head_json || restPage.seo;

      if (pageData) {
        pageData.scf = scfData;
        pageData.acf = scfData;
        if (seoData) pageData.seo = seoData;
      } else {
        pageData = {
          id: String(restPage.id),
          databaseId: restPage.id,
          title: restPage.title?.rendered || '',
          slug: restPage.slug,
          content: restPage.content?.rendered || '',
          scf: scfData,
          acf: scfData,
          seo: seoData,
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
          seo: item.rank_math_seo || item.yoast_head_json || item.seo,
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
