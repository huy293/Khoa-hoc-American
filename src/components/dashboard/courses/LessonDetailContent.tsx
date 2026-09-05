'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/dashboard/courses/LessonDetailContent.module.css';
import { WPCourse, WPLesson, WPCourseSection, WPCourseLessonItem } from '@/types/wordpress';
import { toSlug, parseLessonVideo } from '@/lib/wordpress-format';

interface LessonDetailContentProps {
    course?: WPCourse | null;
    lesson?: WPLesson | null;
    slug: string;
    lessonSlug: string;
    isStudent?: boolean;
    basePath?: string;
}

const defaultLessonsList: Array<{
    id: string;
    number: number;
    title: string;
    videos: number;
    exercises: number;
    duration: string;
    lesson_videos?: string;
}> = [
        {
            id: '1',
            number: 1,
            title: 'Introduction to HydraFacial Technology',
            videos: 2,
            exercises: 1,
            duration: '45 min',
        },
        {
            id: '2',
            number: 2,
            title: 'Skin Anatomy & Skin Types',
            videos: 2,
            exercises: 1,
            duration: '45 min',
        },
        {
            id: '3',
            number: 3,
            title: 'How the HydraFacial System Works',
            videos: 2,
            exercises: 1,
            duration: '45 min',
        },
        {
            id: '4',
            number: 4,
            title: 'Understanding HydraFacial Tips',
            videos: 2,
            exercises: 1,
            duration: '45 min',
        },
        {
            id: '5',
            number: 5,
            title: 'Serums & Active Ingredients',
            videos: 2,
            exercises: 1,
            duration: '45 min',
        },
    ];

export default function LessonDetailContent({
    course,
    lesson,
    slug,
    lessonSlug,
    isStudent = true,
    basePath: customBasePath,
}: LessonDetailContentProps) {
    const [showQuiz, setShowQuiz] = useState(false);

    const basePath = customBasePath || (isStudent ? `/student/courses/${slug}` : `/courses/${slug}`);

    // 🎯 Quiz data từ plugin lp-embed-quiz-in-lesson
    const embeddedQuiz = lesson?.quiz ?? null;
    const hasQuiz = Boolean(embeddedQuiz?.id || lesson?.quiz_id || slug?.includes('hydra'));

    // Xác định quizSlug: ưu tiên slug từ backend, fallback trích xuất từ permalink, title hoặc ID
    let quizSlug = 'quiz-1-introduction-to-hydrafacial-technology';
    if (embeddedQuiz?.slug) {
        quizSlug = embeddedQuiz.slug;
    } else if (embeddedQuiz?.permalink) {
        const cleanPerm = embeddedQuiz.permalink.replace(/\/+$/, '');
        const seg = cleanPerm.split('/').pop();
        if (seg) quizSlug = seg;
    } else if (embeddedQuiz?.title) {
        quizSlug = toSlug(embeddedQuiz.title);
    } else if (lesson?.quiz_id || embeddedQuiz?.id) {
        quizSlug = String(lesson?.quiz_id || embeddedQuiz?.id);
    }

    const quizUrl = `${basePath}/quizzes/${quizSlug}?lesson=${lessonSlug}`;

    // Tạo URL quiz có thể render trong Next.js Headless context
    // Plugin trả về permalink dạng: https://course-amc.homenest.edu.vn/quizzes/ten-quiz
    // Chúng ta render thẳng qua iframe vì quiz cần LearnPress JS chạy trên WP domain
    const quizIframeSrc = embeddedQuiz?.permalink || '';
    const quizTitle = embeddedQuiz?.title || 'Lesson Quiz';
    // 🎯 Extract course trainer info
    const trainerObj = course?.courseFields?.trainer;
    const trainerName =
        (typeof trainerObj?.name === 'string' && trainerObj.name) ||
        (typeof course?.courseFields?.instructor === 'string' && course.courseFields.instructor) ||
        'Kathleen trainer';
    const trainerAvatar =
        (typeof trainerObj?.avatar === 'string' && trainerObj.avatar) ||
        '/images/kathleen.png';
    const trainerRating =
        (typeof trainerObj?.rating === 'string' && trainerObj.rating) ||
        (typeof course?.courseFields?.rating === 'string' && course.courseFields.rating) ||
        '4.9/5.0';

    // 🎯 Extract sections & active module
    const sections: WPCourseSection[] = Array.isArray(course?.sections)
        ? course.sections
        : (Array.isArray(course?.courseFields?.sections) ? course.courseFields.sections : []);

    let activeSectionIndex = 0;
    let foundSection: WPCourseSection | null = null;

    if (sections.length > 0) {
        const foundIdx = sections.findIndex((sec) =>
            Array.isArray(sec.items) &&
            sec.items.some((it) => {
                const itemSlug = it.slug || toSlug(it.title || '') || String(it.id);
                return itemSlug === lessonSlug || String(it.id) === lessonSlug;
            })
        );
        if (foundIdx !== -1) {
            activeSectionIndex = foundIdx;
            foundSection = sections[foundIdx];
        } else {
            foundSection = sections[0];
        }
    }

    const moduleNumber = activeSectionIndex + 1;
    const moduleNumberPad = moduleNumber < 10 ? `0${moduleNumber}` : `${moduleNumber}`;
    const rawModuleTitle = typeof foundSection?.title === 'string'
        ? foundSection.title
        : (typeof foundSection?.name === 'string' ? foundSection.name : 'Theory');
    const moduleTitle = rawModuleTitle.startsWith('Module')
        ? rawModuleTitle
        : `Module ${moduleNumberPad}: ${rawModuleTitle}`;

    // 🎯 Extract lessons list for current module
    const rawItems: WPCourseLessonItem[] = (foundSection && Array.isArray(foundSection.items)) ? foundSection.items : [];

    const lessonsList = rawItems.length > 0
        ? rawItems.map((it, idx) => {
            const title = typeof it.title === 'string' ? it.title : `Lesson 0${idx + 1}`;
            const cleanSlug = it.slug || toSlug(title) || String(it.id || idx + 1);
            return {
                id: String(it.id || idx + 1),
                slug: cleanSlug,
                number: idx + 1,
                title,
                videos: 2,
                exercises: 1,
                duration: (typeof it.duration === 'string' && it.duration) ? it.duration : '45 min',
                lesson_videos: it.lesson_videos || it.acf?.lesson_videos || (it as any).meta?.lesson_videos || it.video_url,
            };
        })
        : defaultLessonsList.map((d) => ({ ...d, slug: toSlug(d.title) || d.id }));

    // Find current lesson title and details
    const currentLessonItem = lessonsList.find(
        (l) => l.slug === lessonSlug || toSlug(l.title) === lessonSlug || String(l.id) === lessonSlug
    ) || lessonsList[0];

    const rawLessonTitle = typeof lesson?.title === 'string'
        ? lesson.title
        : (typeof (lesson?.title as any)?.rendered === 'string'
            ? (lesson?.title as any).rendered
            : (currentLessonItem?.title || 'Introduction to HydraFacial Technology'));

    const displayTitle = rawLessonTitle.toUpperCase().startsWith('INTRODUCTION')
        ? rawLessonTitle.toUpperCase()
        : `${rawLessonTitle.toUpperCase()}`;

    const rawExcerpt = typeof lesson?.excerpt === 'string'
        ? lesson.excerpt
        : (typeof (lesson?.excerpt as any)?.rendered === 'string' ? (lesson?.excerpt as any).rendered : '');
    const rawContent = typeof lesson?.content === 'string'
        ? lesson.content
        : (typeof (lesson?.content as any)?.rendered === 'string' ? (lesson?.content as any).rendered : '');
    const cleanContentExcerpt = rawContent ? rawContent.replace(/<[^>]*>/g, '').slice(0, 180) : '';

    const displayDesc = rawExcerpt || cleanContentExcerpt ||
        'Learn the essential techniques behind professional deep cleansing and exfoliation. This lesson covers proper skin preparation, product application, handpiece control, and key safety considerations to help you perform the treatment with confidence and precision.';

    const videoThumb = lesson?.featuredImage?.node?.sourceUrl ||
        course?.featuredImage?.node?.sourceUrl ||
        '/images/courses/card-hydra.jpg';

    // 🎯 Trích xuất video bài học từ trường ACF lesson_videos / video_url
    const rawLessonVideo =
        lesson?.lesson_videos ||
        lesson?.acf?.lesson_videos ||
        (lesson as any)?.acf?.lesson_video ||
        (lesson as any)?.meta?.lesson_videos ||
        lesson?.video_url ||
        currentLessonItem?.lesson_videos ||
        (currentLessonItem as any)?.acf?.lesson_videos ||
        (currentLessonItem as any)?.video_url ||
        '';

    let parsedVideo = parseLessonVideo(rawLessonVideo);

    // 🎯 Fallback: nếu ACF trống nhưng trong nội dung bài học (content) có chèn mã nhúng iframe video
    if (!parsedVideo && rawContent) {
        parsedVideo = parseLessonVideo(rawContent);
    }

    // 🎯 Calculate Next Lesson & Next Module links
    const currentLessonIdx = lessonsList.findIndex(
        (l) => l.slug === lessonSlug || toSlug(l.title) === lessonSlug || String(l.id) === lessonSlug
    );

    let nextLessonUrl = basePath;
    if (currentLessonIdx !== -1 && currentLessonIdx < lessonsList.length - 1) {
        const nextItem = lessonsList[currentLessonIdx + 1];
        nextLessonUrl = `${basePath}/lessons/${nextItem.slug}`;
    } else if (sections.length > activeSectionIndex + 1) {
        const nextSec = sections[activeSectionIndex + 1];
        const nextSecFirstItem = (nextSec.items && nextSec.items.length > 0) ? nextSec.items[0] : null;
        if (nextSecFirstItem) {
            const nextSecSlug = nextSecFirstItem.slug || toSlug(nextSecFirstItem.title || '') || String(nextSecFirstItem.id);
            nextLessonUrl = `${basePath}/lessons/${nextSecSlug}`;
        }
    }

    let nextModuleUrl = basePath;
    if (sections.length > activeSectionIndex + 1) {
        const nextSec = sections[activeSectionIndex + 1];
        const nextSecFirstItem = (nextSec.items && nextSec.items.length > 0) ? nextSec.items[0] : null;
        if (nextSecFirstItem) {
            const nextSecSlug = nextSecFirstItem.slug || toSlug(nextSecFirstItem.title || '') || String(nextSecFirstItem.id);
            nextModuleUrl = `${basePath}/lessons/${nextSecSlug}`;
        }
    }

    return (
        <main className={styles['lesson-page']}>
            <div className={styles['lesson-page__container']}>
                {/* 1. Header: Back Arrow, Title, Description & Trainer */}
                <header className={styles['lesson-header']}>
                    <div className={styles['lesson-header__left']}>
                        <div className={styles['lesson-header__title-row']}>
                            <Link
                                href={basePath}
                                className={styles['lesson-header__back-btn']}
                                aria-label="Back to Course Details"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </Link>
                            <h1 className={styles['lesson-header__title']}>{displayTitle}</h1>
                        </div>
                        <p className={styles['lesson-header__desc']}>{displayDesc}</p>
                    </div>

                    <div className={styles['trainer-card']}>
                        <div className={styles['trainer-card__profile']}>
                            <div className={styles['trainer-card__avatar-wrap']}>
                                <Image
                                    src={trainerAvatar}
                                    alt={trainerName}
                                    width={48}
                                    height={48}
                                    className={styles['trainer-card__avatar']}
                                    unoptimized
                                />
                            </div>
                            <div className={styles['trainer-card__info']}>
                                <span className={styles['trainer-card__name']}>{trainerName}</span>
                                <span className={styles['trainer-card__rating']}>
                                    ★ {trainerRating}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className={styles['trainer-card__chat-btn']}
                            aria-label="Messages"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                            </svg>
                            <span className={styles['trainer-card__chat-badge']}>3</span>
                        </button>
                    </div>
                </header>

                {/* 2. Main 2-Column Content: Player + Sidebar */}
                <div className={styles['lesson-grid']}>
                    {/* Left Column: Video Player & Action Buttons */}
                    <div className={styles['lesson-main']}>
                        <div className={styles['video-container']}>
                            {parsedVideo ? (
                                parsedVideo.type === 'iframe' && parsedVideo.src ? (
                                    <iframe
                                        src={parsedVideo.src}
                                        title={displayTitle}
                                        className={styles['video-container__iframe']}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    />
                                ) : parsedVideo.type === 'video' && parsedVideo.src ? (
                                    <video
                                        src={parsedVideo.src}
                                        controls
                                        playsInline
                                        poster={videoThumb}
                                        className={styles['video-container__video']}
                                    />
                                ) : parsedVideo.type === 'html' && parsedVideo.html ? (
                                    <div
                                        className={styles['video-container__embed']}
                                        dangerouslySetInnerHTML={{ __html: parsedVideo.html }}
                                    />
                                ) : (
                                    <Image
                                        src={videoThumb}
                                        alt={displayTitle}
                                        fill
                                        className={styles['video-container__thumb']}
                                        priority
                                        unoptimized
                                    />
                                )
                            ) : (
                                <>
                                    <Image
                                        src={videoThumb}
                                        alt={displayTitle}
                                        fill
                                        className={styles['video-container__thumb']}
                                        priority
                                        unoptimized
                                    />
                                    <button
                                        type="button"
                                        className={styles['video-container__play-btn']}
                                        aria-label="Play Lesson Video"
                                    >
                                        <svg
                                            className={styles['video-container__play-icon']}
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>

                        <div className={styles['lesson-actions']}>
                            <Link
                                href={nextLessonUrl}
                                className={styles['lesson-actions__next-btn']}
                            >
                                <span>NEXT LESSON</span>
                                <span>→</span>
                            </Link>

                            {hasQuiz && (
                                <Link
                                    href={quizUrl}
                                    className={styles['lesson-actions__quiz-btn']}
                                >
                                    <span>TAKE QUIZ</span>
                                    <span>→</span>
                                </Link>
                            )}
                        </div>

                        {/* 🎓 Quiz Panel nhúng từ plugin lp-embed-quiz-in-lesson */}
                        {hasQuiz && showQuiz && (
                            <div className={styles['quiz-panel']}>
                                <div className={styles['quiz-panel__header']}>
                                    <div className={styles['quiz-panel__icon']}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                            <line x1="12" y1="17" x2="12.01" y2="17" />
                                        </svg>
                                    </div>
                                    <h3 className={styles['quiz-panel__title']}>{quizTitle}</h3>
                                    <button
                                        type="button"
                                        className={styles['quiz-panel__close']}
                                        onClick={() => setShowQuiz(false)}
                                        aria-label="Close quiz"
                                    >
                                        ✕
                                    </button>
                                </div>
                                {quizIframeSrc ? (
                                    <iframe
                                        src={quizIframeSrc}
                                        title={quizTitle}
                                        className={styles['quiz-panel__iframe']}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media"
                                        allowFullScreen
                                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                                    />
                                ) : (
                                    <div className={styles['quiz-panel__no-url']}>
                                        <p>Không thể tải quiz. Vui lòng thử lại sau.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Module & Lessons Sidebar */}
                    <aside className={styles['lesson-sidebar']}>
                        {/* Module Top Info Box */}
                        <div className={styles['module-header-box']}>
                            <div className={styles['module-header-box__icon']}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#D8B068" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#D8B068" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className={styles['module-header-box__info']}>
                                <h3 className={styles['module-header-box__title']}>{moduleTitle}</h3>
                                <p className={styles['module-header-box__meta']}>
                                    {lessonsList.length} lessons • 1 lesson/45 min
                                </p>
                            </div>
                        </div>

                        {/* List title */}
                        <h4 className={styles['sidebar-list-title']}>
                            List lessons of {rawModuleTitle.toLowerCase().startsWith('module') ? rawModuleTitle.toLowerCase() : `module ${moduleNumberPad}`}
                        </h4>

                        {/* Lessons List */}
                        <div className={styles['sidebar-lessons']}>
                            {lessonsList.map((item) => {
                                const isActive = item.slug === lessonSlug || toSlug(item.title) === lessonSlug || String(item.id) === lessonSlug;
                                return (
                                    <Link
                                        key={item.id}
                                        href={`${basePath}/lessons/${item.slug}`}
                                        className={`${styles['sidebar-lesson-item']} ${isActive ? styles['sidebar-lesson-item--active'] : ''
                                            }`}
                                    >
                                        <span className={styles['sidebar-lesson-item__badge']}>
                                            {item.number}
                                        </span>
                                        <div className={styles['sidebar-lesson-item__content']}>
                                            <h5 className={styles['sidebar-lesson-item__title']}>
                                                {item.title}
                                            </h5>
                                            <p className={styles['sidebar-lesson-item__meta']}>
                                                {item.videos} videos • {item.exercises} exercise • {item.duration}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Next Module Link */}
                        <div className={styles['next-module-wrap']}>
                            <Link href={nextModuleUrl} className={styles['next-module-link']}>
                                <span>NEXT MODULE</span>
                                <span>→</span>
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
