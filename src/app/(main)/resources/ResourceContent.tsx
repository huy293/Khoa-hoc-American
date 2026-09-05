'use client';

import { useState } from 'react';
import ButtonStyle1 from '@/components/common/ButtonStyle1';
import HeaderText from '@/components/common/HeaderText';
import styles from '@/styles/resources/ResourceContent.module.css';
import ResourceBlogCard from '@/components/cards/ResourceBlogCard';

import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { EffectFade, FreeMode } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/free-mode';

import { WPPost, WPResourcesFields } from '@/types/wordpress';

const DEFAULT_POST_IMAGES = [
    '/images/courses/card-hydra.jpg',
    '/images/courses/card-derma.jpg',
    '/images/courses/card-towel.jpg',
    '/images/courses/card-advance.jpg',
];

const DEFAULT_GALLERY_IMAGES = [
    '/images/gallery/image-1.jpg',
    '/images/gallery/image-2.jpg',
    '/images/gallery/image-3.jpg',
    '/images/gallery/image-4.jpg',
    '/images/gallery/image-5.jpg',
    '/images/gallery/image-6.jpg',
    '/images/gallery/image-7.jpg',
    '/images/gallery/image-8.jpg',
    '/images/gallery/image-9.jpg',
    '/images/gallery/image-10.jpg',
];

interface ResourceContentProps {
    initialPosts?: WPPost[];
    data?: Partial<WPResourcesFields>;
}

export default function ResourceContent({ initialPosts, data }: ResourceContentProps = {}) {
    const [mainSwiper, setMainSwiper] = useState<SwiperType | null>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [visibleCount, setVisibleCount] = useState<number>(4);

    const rawGallery: string[] = (data?.resources_gallery_images && data.resources_gallery_images.length > 0)
        ? data.resources_gallery_images.map((img: any) => {
            if (typeof img === 'string') return img;
            if (img?.sourceUrl) return img.sourceUrl;
            if (typeof img?.image === 'string') return img.image;
            if (img?.image?.sourceUrl) return img.image.sourceUrl;
            return '/images/gallery/image-1.jpg';
        })
        : DEFAULT_GALLERY_IMAGES;
    const galleryImages = rawGallery.length < 10 ? [...rawGallery, ...rawGallery] : rawGallery;

    // Map WordPress Posts or Fallback Posts
    const postsList = (initialPosts && initialPosts.length > 0)
        ? initialPosts.map((post, index) => {
            const rawExcerpt = post.excerpt ? post.excerpt.replace(/<[^>]*>/g, '').trim() : '';
            const dateStr = post.date
                ? new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Dec 28, 2026';
            const wordCount = (post.content || post.excerpt || '').split(/\s+/).length;
            const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

            return {
                id: post.id || String(post.databaseId || index),
                slug: post.slug,
                image: post.featuredImage?.node?.sourceUrl || DEFAULT_POST_IMAGES[index % DEFAULT_POST_IMAGES.length],
                title: post.title,
                description: rawExcerpt || 'Practical advice from experienced beauty educators to help you assess client needs.',
                author: {
                    name: post.author?.node?.name || 'Thy Anh Pham Nguyen',
                    avatar: post.author?.node?.avatar?.url || '/images/home/coutrue-beauty-academy_member.png',
                    date: dateStr,
                },
                readTime: `${readMinutes} min read`,
            };
        })
        : [];

    const visiblePosts = postsList.slice(0, visibleCount);

    const handleLoadMore = () => {
        setVisibleCount((prev) => Math.min(prev + 4, postsList.length));
    };

    return (
        <>
            {/* ==========================================
                1. Hero Section
               ========================================== */}
            <section className={styles['resources-hero']}>
                <div className={styles['resources-hero__wrapper']}>
                    <div className={styles['resources-hero__content']}>
                        <p className={styles['resources-hero__subtitle']}>{data?.resources_hero_subtitle || "Explore. Learn. Be Inspired"}</p>
                        {/* Đường line */}
                        <span className={styles['resources-hero__divider']}></span>
                        <h1
                            className={styles['resources-hero__title']}
                            dangerouslySetInnerHTML={{ __html: data?.resources_hero_title || "Resources for Your Beauty Journey" }}
                        />
                        <p className={styles['resources-hero__description']}>
                            {data?.resources_hero_desc || "Explore expert articles, training videos, and inspiring moments from our academy to support your learning and professional growth."}
                        </p>

                        <div className={styles['resources-hero__actions']}>
                            <a href={data?.resources_hero_btn_1_link || "/about-us"} className={styles['resources-hero__btn-about']}>
                                {data?.resources_hero_btn_1_text || "about us"}
                            </a>
                            <a href={data?.resources_hero_btn_2_link || "/courses"} className={styles['resources-hero__btn-courses']}>
                                <span>{data?.resources_hero_btn_2_text || "Explore Our Courses"}</span>
                                <svg
                                    className={styles['resources-hero__btn-icon']}
                                    width="18"
                                    height="12"
                                    viewBox="0 0 18 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M1 6H16.5M16.5 6L11.5 1M16.5 6L11.5 11"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <img
                    className={styles['resources-hero__bg-image']}
                    src={typeof data?.resources_hero_bg === 'string' ? data.resources_hero_bg : (data?.resources_hero_bg?.sourceUrl || "/images/background-resources.jpg")}
                    alt="Resources Hero Background"
                />
            </section>

            {/* ==========================================
                2. Blog Section
               ========================================== */}
            <section className={styles['resources-blog']}>
                <div className={styles['resources-blog__wrapper']}>
                    <div className={styles['resources-blog__container']}>
                        <div className={styles['resources-blog__header']}>
                            <HeaderText
                                className={styles['resources-blog__header-left']}
                                eyebrowClassName={styles['resources-blog__eyebrow']}
                                dividerClassName={styles['resources-blog__divider']}
                                titleClassName={styles['resources-blog__title']}
                                eyebrow={data?.resources_blog_eyebrow || "Blog"}
                                title={
                                    data?.resources_blog_title ? (
                                        <span dangerouslySetInnerHTML={{ __html: data.resources_blog_title }} />
                                    ) : (
                                        <>
                                            Blog Us About <br />
                                            Beauty Insights &amp; Expert Advice
                                        </>
                                    )
                                }
                            />

                            <div className={styles['resources-blog__header-right']}>
                                <p className={styles['resources-blog__description']}>
                                    {data?.resources_blog_desc || "Explore expert tips, industry trends, treatment knowledge"}
                                </p>
                                <ButtonStyle1
                                    className={styles['resources-blog__btn']}
                                    text="about us"
                                />
                            </div>
                        </div>

                        <div className={styles['resources-blog__grid']}>
                            {visiblePosts.map((post) => (
                                <ResourceBlogCard
                                    key={post.id}
                                    slug={post.slug}
                                    image={post.image}
                                    title={post.title}
                                    description={post.description}
                                    author={post.author}
                                    readTime={post.readTime}
                                />
                            ))}
                        </div>

                        {/* Load More Button */}
                        {visibleCount < postsList.length && (
                            <div className={styles['resources-blog__footer']}>
                                <button
                                    type="button"
                                    className={styles['resources-blog__load-more']}
                                    onClick={handleLoadMore}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                    <span>Load more ({postsList.length - visibleCount} remaining)</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ==========================================
                3. Gallery Section
               ========================================== */}
            <section className={styles['resources-gallery']}>
                <div className={styles['resources-gallery__wrapper']}>
                    <div className={styles['resources-gallery__container']}>
                        <div className={styles['resources-gallery__header']}>
                            <HeaderText
                                className={styles['resources-gallery__header-left']}
                                eyebrowClassName={styles['resources-gallery__eyebrow']}
                                dividerClassName={styles['resources-gallery__divider']}
                                titleClassName={styles['resources-gallery__title']}
                                eyebrow={data?.resources_gallery_eyebrow || "GALLERY"}
                                title={
                                    data?.resources_gallery_title ? (
                                        <span dangerouslySetInnerHTML={{ __html: data.resources_gallery_title }} />
                                    ) : "Inside Couture Beauty Academy"
                                }
                            />
                            <div className={styles['resources-gallery__header-right']}>
                                <p className={styles['resources-gallery__description']}>
                                    {data?.resources_gallery_desc || "Explore expert tips, industry trends, treatment knowledge"}
                                </p>
                                <ButtonStyle1
                                    className={styles['resources-gallery__btn']}
                                    text="about us"
                                />
                            </div>
                        </div>
                        <div className={styles['resources-gallery__slider-wrapper']}>
                            {/* Main Preview Swiper */}
                            <div className={styles['resources-gallery__main-wrapper']}>
                                <Swiper
                                    modules={[EffectFade]}
                                    effect="fade"
                                    fadeEffect={{ crossFade: true }}
                                    loop={true}
                                    onSwiper={setMainSwiper}
                                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                                    className={styles['resources-gallery__main-swiper']}
                                >
                                    {galleryImages.map((src, index) => (
                                        <SwiperSlide key={index} className={styles['resources-gallery__main-slide']}>
                                            <div className={styles['resources-gallery__main-image-box']}>
                                                <img
                                                    src={src}
                                                    alt={`Couture Beauty Academy gallery ${index + 1}`}
                                                    className={styles['resources-gallery__main-image']}
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                {/* Prev Navigation Overlay & Button */}
                                <div className={`${styles['resources-gallery__nav-side']} ${styles['resources-gallery__nav-side--prev']}`}>
                                    <button
                                        type="button"
                                        onClick={() => mainSwiper?.slidePrev()}
                                        className={styles['resources-gallery__nav-btn']}
                                        aria-label="Previous gallery image"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="15 18 9 12 15 6" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Next Navigation Overlay & Button */}
                                <div className={`${styles['resources-gallery__nav-side']} ${styles['resources-gallery__nav-side--next']}`}>
                                    <button
                                        type="button"
                                        onClick={() => mainSwiper?.slideNext()}
                                        className={styles['resources-gallery__nav-btn']}
                                        aria-label="Next gallery image"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="9 18 15 12 9 6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Thumbnails Row (Single Row & Draggable) */}
                            <div className={styles['resources-gallery__thumbs-wrapper']}>
                                <Swiper
                                    modules={[FreeMode]}
                                    freeMode={true}
                                    grabCursor={true}
                                    spaceBetween={12}
                                    slidesPerView={10}
                                    breakpoints={{
                                        0: { slidesPerView: 4, spaceBetween: 5 },
                                        576: { slidesPerView: 5, spaceBetween: 8 },
                                        768: { slidesPerView: 7, spaceBetween: 10 },
                                        996: { slidesPerView: 8, spaceBetween: 12 },
                                        1200: { slidesPerView: 9, spaceBetween: 12 },
                                        1366: { slidesPerView: 10, spaceBetween: 12 },
                                    }}
                                    className={styles['resources-gallery__thumbs-swiper']}
                                >
                                    {galleryImages.map((src, index) => (
                                        <SwiperSlide key={index} className={styles['resources-gallery__thumb-slide']}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    mainSwiper?.slideToLoop(index);
                                                    setActiveIndex(index);
                                                }}
                                                className={`${styles['resources-gallery__thumb-item']} ${activeIndex === index ? styles['resources-gallery__thumb-item--active'] : ''
                                                    }`}
                                                aria-label={`View image ${index + 1}`}
                                            >
                                                <img
                                                    src={src}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className={styles['resources-gallery__thumb-img']}
                                                />
                                            </button>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}