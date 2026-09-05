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

export interface WPSpecializedItem {
  title: string;
  description: string;
}

export interface WPInstructorCard {
  quote_text?: string;
  quote_author?: string;
  name: string;
  role: string;
  bio?: string;
  tags?: string | string[];
  image?: string | WPImage;
}

export interface WPTestimonialItem {
  name: string;
  role: string;
  comment: string;
  avatar?: string | WPImage;
}

export interface WPPartnerLogo {
  name?: string;
  logo?: string | WPImage;
}

export interface WPImpactCounter {
  number: string;
  script_text?: string;
  label: string;
}

export interface WPCampusVisit {
  visit_eyebrow?: string;
  visit_title?: string;
  visit_description?: string;
  visit_address?: string;
  visit_btn_text?: string;
  visit_btn_link?: string;
  visit_image?: string | WPImage;
}

export interface WPHomeFields {
  // Hero
  hero_eyebrow?: string;
  hero_description?: string;
  hero_btn_1_text?: string;
  hero_btn_1_link?: string;
  hero_btn_2_text?: string;
  hero_btn_2_link?: string;
  hero_member_image?: string | WPImage;
  hero_bg_image?: string | WPImage;
  // Who We Teach
  who_eyebrow?: string;
  who_title?: string;
  who_description?: string;
  who_image_1?: string | WPImage;
  who_image_2?: string | WPImage;
  who_badge_1?: string;
  who_badge_2?: string;
  who_instructor_avatar?: string | WPImage;
  who_instructor_name?: string;
  who_instructor_role?: string;
  who_btn_text?: string;
  who_btn_link?: string;
  // Our Peoples
  home_people_eyebrow?: string;
  home_people_title?: string;
  home_people_desc?: string;
  home_people_quote?: string;
  home_people_author?: string;
  home_people_list?: WPInstructorCard[];
  // The Couture Method
  method_title?: string;
  method_video?: string;
  method_steps?: Array<{
    title: string;
    desc: string;
  }>;
  // Ready to Start Learning
  ready_eyebrow?: string;
  ready_title?: string;
  ready_cards?: Array<{
    title: string;
    description: string;
    link_text?: string;
    link_url?: string;
    image?: string | WPImage;
  }>;
}

export interface WPAboutFields {
  // Shared Components
  spec_eyebrow?: string;
  spec_title?: string;
  spec_image?: string | WPImage;
  spec_items?: WPSpecializedItem[];
  about_spec_eyebrow?: string;
  about_spec_title?: string;
  about_spec_image?: string | WPImage;
  about_spec_items?: WPSpecializedItem[];

  instructor_eyebrow?: string;
  instructor_title?: string;
  instructor_desc?: string;
  instructor_cards?: WPInstructorCard[];
  about_instructors_eyebrow?: string;
  about_instructors_title?: string;
  about_instructors_desc?: string;
  about_instructors?: WPInstructorCard[];

  testi_eyebrow?: string;
  testi_title?: string;
  testi_list?: WPTestimonialItem[];

  impact_eyebrow?: string;
  impact_title?: string;
  impact_desc?: string;
  impact_link_text?: string;
  impact_link_url?: string;
  impact_counters?: WPImpactCounter[];

  // About Hero Specific
  about_hero_eyebrow?: string;
  about_hero_title?: string;
  about_hero_description?: string;
  about_hero_desc?: string;
  about_hero_btn_1_text?: string;
  about_hero_btn_1_link?: string;
  about_hero_btn_2_text?: string;
  about_hero_btn_2_link?: string;
  about_hero_image_1?: string | WPImage;
  about_hero_image_2?: string | WPImage;
  about_hero_img_1?: string | WPImage;
  about_hero_img_2?: string | WPImage;
}

export interface WPCoursesFields {
  // Shared
  partner_logos?: WPPartnerLogo[];
  impact_eyebrow?: string;
  impact_title?: string;
  impact_desc?: string;
  impact_link_text?: string;
  impact_link_url?: string;
  impact_counters?: WPImpactCounter[];
  instructor_eyebrow?: string;
  instructor_title?: string;
  instructor_desc?: string;
  instructor_cards?: WPInstructorCard[];

  // Courses Hero Specific
  course_hero_eyebrow?: string;
  course_hero_title?: string;
  course_hero_badge_1?: string;
  course_hero_badge_2?: string;
  course_hero_description?: string;
  course_hero_btn_1_text?: string;
  course_hero_btn_1_link?: string;
  course_hero_btn_2_text?: string;
  course_hero_btn_2_link?: string;
  course_hero_bg?: string | WPImage;
}

export interface WPResourcesFields {
  resources_hero_subtitle?: string;
  resources_hero_title?: string;
  resources_hero_desc?: string;
  resources_hero_btn_1_text?: string;
  resources_hero_btn_1_link?: string;
  resources_hero_btn_2_text?: string;
  resources_hero_btn_2_link?: string;
  resources_hero_bg?: string | WPImage;
  resources_blog_eyebrow?: string;
  resources_blog_title?: string;
  resources_blog_desc?: string;
  resources_gallery_eyebrow?: string;
  resources_gallery_title?: string;
  resources_gallery_desc?: string;
  resources_gallery_images?: Array<string | WPImage | { image?: string | WPImage; sourceUrl?: string }>;
}

export interface WPContactFields {
  contact_eyebrow?: string;
  contact_hero_eyebrow?: string;
  contact_title?: string;
  contact_hero_title?: string;
  contact_description?: string;
  contact_hero_desc?: string;
  contact_schedule_title?: string;
  contact_schedule_hours?: string;
  contact_hours_label?: string;
  contact_hours_val?: string;
  contact_campus_address?: string;
  contact_campus_label?: string;
  contact_campus_val?: string;
  contact_bg_image?: string | WPImage;
  contact_facebook?: string;
  contact_instagram?: string;
  contact_twitter?: string;
  contact_social_facebook?: string;
  contact_social_instagram?: string;
  contact_social_twitter?: string;
}

export interface WPShopFields {
  shop_banner_title?: string;
  shop_banner_description?: string;
  shop_banner_desc?: string;
  shop_banner_image?: string | WPImage;
}

export interface WPPage<T = Record<string, unknown>> {
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
  scf?: T;
  acf?: T;
  seo?: WPSeo;
  [key: string]: unknown;
}

export interface WPCourseLessonItem {
  id?: string | number;
  title?: string;
  slug?: string;
  type?: string;
  preview?: boolean;
  duration?: string;
  graduation?: string;
  status?: string;
  locked?: boolean;
  content?: string;
  video_url?: string;
  lesson_videos?: string;
  acf?: {
    lesson_videos?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface WPLesson {
  id: string | number;
  databaseId?: number;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  duration?: string;
  preview?: boolean;
  locked?: boolean;
  video_url?: string;
  lesson_videos?: string;
  acf?: {
    lesson_videos?: string;
    [key: string]: unknown;
  };
  featuredImage?: {
    node?: WPImage;
  };
  seo?: WPSeo;
  /** Quiz nhúng từ plugin lp-embed-quiz-in-lesson */
  quiz?: {
    id: number;
    title: string;
    slug?: string;
    permalink: string;
  } | null;
  quiz_id?: number | null;
  require_pass?: boolean;
  [key: string]: unknown;
}

export interface WPCourseSection {
  id?: string | number;
  title?: string;
  name?: string;
  course_id?: number | string;
  description?: string;
  order?: string | number;
  items?: WPCourseLessonItem[];
  [key: string]: unknown;
}

export interface WPCourseFields {
  duration?: string;
  level?: string;
  price?: number | string;
  originalPrice?: number | string;
  instructor?: string;
  tag?: string;
  category?: string;
  lessons?: string;
  subtitle?: string;
  module?: string;
  quizzes?: string;
  rating?: string;
  traineeCount?: string;
  trainer?: {
    name?: string;
    avatar?: string;
    rating?: string;
    [key: string]: unknown;
  };
  sections?: WPCourseSection[];
  curriculum?: Array<{
    id?: string | number;
    title: string;
    lessons?: string[];
    items?: WPCourseLessonItem[];
  } | string>;
  benefits?: string[];
  about_img_left?: string | WPImage;
  about_img_center?: string | WPImage;
  about_img_right?: string | WPImage;
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
  sections?: WPCourseSection[];
  courseFields?: WPCourseFields;
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
  seo?: WPSeo;
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

export interface WPAuthUser {
  id?: number | string;
  username?: string;
  email?: string;
  displayName?: string;
  name?: string;
  role?: 'student' | 'teacher' | 'instructor' | 'administrator' | string;
  avatar?: string;
  phone?: string;
  redirectUrl?: string;
}

export interface WPQuizOption {
  id: string;
  title: string;
}

export interface WPQuizQuestion {
  id: number;
  title: string;
  content?: string;
  type?: 'single_choice' | 'multi_choice' | 'true_or_false' | string;
  options: WPQuizOption[];
}

export interface WPQuizDetail {
  id: number;
  slug?: string;
  title: string;
  content?: string;
  duration_seconds: number;
  passing_grade: number;
  questions_count: number;
  questions: WPQuizQuestion[];
  seo?: any;
}

export interface WPQuizQuestionResult {
  question_id: number;
  selected_answer_id: string;
  correct_answer_id?: string | null;
  is_correct: boolean;
}

export interface WPQuizSubmitResponse {
  success: boolean;
  quiz_id: number;
  score: number;
  passing_grade: number;
  passed: boolean;
  correct_count: number;
  total_questions: number;
  results: WPQuizQuestionResult[];
}


