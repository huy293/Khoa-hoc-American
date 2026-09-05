"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/styles/dashboard/courses/CourseDetailsIntro.module.css";

import { WPCourse } from "@/types/wordpress";
import { toSlug } from "@/lib/wordpress-format";

export interface CourseModule {
    id: string;
    title: string;
    lessonsCount: number;
    duration: string;
    progress: number;
}

export interface CourseDetailsIntroProps {
    category?: string;
    courseName?: string;
    title?: string;
    description?: string;
    instructor?: {
        name: string;
        avatar: string;
        rating: string;
    };
    overallProgress?: number;
    currentModuleTitle?: string;
    currentLessonTitle?: string;
    modules?: CourseModule[];
    course?: WPCourse | null;
}

export default function CourseDetailsIntro({
    category = "TRAINING PROGRAM",
    courseName = "Course Details",
    title = "CHƯƠNG TRÌNH ĐÀO TẠO CHUYÊN SÂU",
    description = "Nắm vững kỹ thuật chuyên môn qua lý thuyết, thực hành lâm sàng và các quy trình chuẩn y khoa dưới sự hướng dẫn của chuyên gia.",
    instructor,
    overallProgress = 0,
    currentModuleTitle,
    currentLessonTitle,
    modules,
    course,
}: CourseDetailsIntroProps) {
    // 🎯 Map dynamic WordPress / LearnPress course data
    const displayCategory = course?.courseFields?.category || category;
    const displayCourseName = course?.title || courseName;
    const displayTitle = course?.title ? `${course.title.toUpperCase()}` : title;
    const displayDescription = course?.excerpt?.replace(/<[^>]*>/g, '').trim() || course?.courseFields?.subtitle || description;

    // Trainer info
    const trainerObj = course?.courseFields?.trainer;
    const displayInstructorName = trainerObj?.name || (typeof course?.courseFields?.instructor === 'string' ? course.courseFields.instructor : '') || (course as any)?.author?.name || instructor?.name || "American Master Trainer";
    const displayInstructorAvatar = trainerObj?.avatar || (course as any)?.author?.avatar || instructor?.avatar || "/images/kathleen.png";
    const displayInstructorRating = trainerObj?.rating || course?.courseFields?.rating || (course?.rating ? `${course.rating}/5.0` : '5.0/5.0');

    // Sections / Modules
    const wpSections = course?.sections || course?.courseFields?.sections;
    const displayModules: CourseModule[] = React.useMemo(() => {
        if (modules && modules.length > 0) return modules;
        if (Array.isArray(wpSections) && wpSections.length > 0) {
            return wpSections.map((sec, idx) => {
                const items = Array.isArray(sec.items) ? sec.items : [];
                const secTitle = sec.title || sec.name || `Module 0${idx + 1}`;
                return {
                    id: String(sec.id || `mod-${idx + 1}`),
                    title: secTitle.startsWith('Module') ? secTitle : `Module 0${idx + 1}: ${secTitle}`,
                    lessonsCount: items.length,
                    duration: "1 lesson/45 min",
                    progress: idx === 0 && overallProgress > 0 ? Math.min(100, overallProgress) : 0,
                };
            });
        }
        return [];
    }, [modules, wpSections]);

    const firstSection = Array.isArray(wpSections) && wpSections.length > 0 ? wpSections[0] : null;
    const firstLesson = firstSection && Array.isArray(firstSection.items) && firstSection.items.length > 0 ? firstSection.items[0] : null;

    const activeModuleTitle = currentModuleTitle || (firstSection ? (firstSection.title?.startsWith('Module') ? firstSection.title : `Module 01: ${firstSection.title || firstSection.name || 'Theory'}`) : "");
    const activeLessonTitle = currentLessonTitle || (firstLesson ? (firstLesson.title || "Lesson 1") : "");

    const continueTitle = course?.title ? `${course.title}` : "Hydra Facial\nProfessional Training";
    const continueDesc = course?.excerpt || "Master professional techniques through theory, hands-on practice, live-model training, and advanced treatment protocols.";

    // Circumference calculation for SVG gauge (radius = 48 -> 2 * PI * 48 ≈ 301.59)
    const gaugeCircumference = 2 * Math.PI * 48;
    const gaugeOffset = gaugeCircumference * (1 - overallProgress / 100);

    // Badge circumference (radius = 23 -> 2 * PI * 23 ≈ 144.51)
    const badgeCircumference = 2 * Math.PI * 23;

    const pathname = usePathname();
    const coursesUrl = pathname?.startsWith('/teacher') ? '/teacher/courses' : '/student/courses';

    const firstLessonSlug = firstLesson?.slug || (firstLesson?.title ? toSlug(firstLesson.title) : String(firstLesson?.id || 'lesson-1'));
    const resumeLessonHref = `${coursesUrl}/${course?.slug || 'hydra-facial'}/lessons/${firstLessonSlug}`;

    return (
        <section className={styles["course-intro"]}>
            <div className={styles["course-intro__container"]}>
                {/* Top Header: Course Title & Description + Instructor Info */}
                <div className={styles["course-intro__header"]}>
                    <div className={styles["course-intro__title-col"]}>
                        {/* Breadcrumb Navigation */}
                        <div className={styles["course-intro__breadcrumb-wrapper"]}>
                            <nav aria-label="Breadcrumb" className={styles["course-intro__breadcrumb"]}>
                                <Link href={coursesUrl} className={styles["breadcrumb__item"]}>
                                    COURSE
                                </Link>
                                <span className={styles["breadcrumb__separator"]}>&gt;</span>
                                <Link href={coursesUrl} className={styles["breadcrumb__item"]}>
                                    {displayCategory}
                                </Link>
                                <span className={styles["breadcrumb__separator"]}>&gt;</span>
                                <span className={styles["breadcrumb__item--active"]}>{displayCourseName}</span>
                            </nav>
                            {/* Top Gradient Divider Line */}
                            <div className={styles["course-intro__divider-line"]} />
                        </div>

                        <h1 className={styles["course-intro__title"]}>{displayTitle}</h1>
                        <p className={styles["course-intro__desc"]}>{displayDescription}</p>
                    </div>

                    <div className={styles["course-intro__instructor"]}>
                        <div className={styles["instructor__avatar-wrap"]}>
                            <Image
                                src={displayInstructorAvatar}
                                alt={displayInstructorName}
                                width={48}
                                height={48}
                                className={styles["instructor__avatar"]}
                            />
                        </div>
                        <div className={styles["instructor__info"]}>
                            <span className={styles["instructor__name"]}>
                                {displayInstructorName}
                            </span>
                            <div className={styles["instructor__rating"]}>
                                <span className={styles["instructor__star"]}>★</span>
                                <span className={styles["instructor__score"]}>
                                    {displayInstructorRating}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Main Two-Column Dashboard Content */}
                <div className={styles["course-intro__grid"]}>
                    {/* Left Card: Continue Your Learning Journey */}
                    <div className={styles["continue-card"]}>
                        <div className={styles["continue-card__top"]}>
                            <div className={styles["continue-card__info"]}>
                                <div className={styles["continue-card__badge-wrap"]}>
                                    <span className={styles["continue-card__badge"]}>
                                        Continue Your Learning Journey
                                    </span>
                                </div>
                                <div className={styles["continue-card__divider-line"]} />
                                <h2 className={styles["continue-card__title"]}>
                                    {continueTitle}
                                </h2>
                                <p className={styles["continue-card__desc"]}>
                                    {continueDesc}
                                </p>
                            </div>

                            {/* Circular Progress Gauge */}
                            <div className={styles["progress-gauge"]}>
                                <svg
                                    className={styles["progress-gauge__svg"]}
                                    viewBox="0 0 120 120"
                                >
                                    <circle
                                        className={styles["progress-gauge__track"]}
                                        cx="60"
                                        cy="60"
                                        r="48"
                                    />
                                    <circle
                                        className={styles["progress-gauge__fill"]}
                                        cx="60"
                                        cy="60"
                                        r="48"
                                        strokeDasharray={gaugeCircumference}
                                        strokeDashoffset={gaugeOffset}
                                    />
                                </svg>
                                <div className={styles["progress-gauge__content"]}>
                                    <span className={styles["progress-gauge__percent"]}>
                                        {overallProgress}%
                                    </span>
                                    <span className={styles["progress-gauge__label"]}>
                                        LEARNING
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Resume Lesson Banner */}
                        <div className={styles["resume-banner"]}>
                            <div className={styles["resume-banner__left"]}>
                                <div className={styles["module-icon-box"]}>
                                    <svg
                                        width="44"
                                        height="44"
                                        viewBox="0 0 62 62"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M52.9587 41.3333V47.7917C52.9587 52.7775 48.9028 56.8333 43.917 56.8333H18.0837C13.0978 56.8333 9.04199 52.7775 9.04199 47.7917V46.1125C9.04199 42.0567 12.3487 38.75 16.4045 38.75H50.3753C51.7962 38.75 52.9587 39.9125 52.9587 41.3333Z"
                                            fill="#D8B068"
                                        />
                                        <path
                                            d="M40.042 5.16602H21.9587C11.6253 5.16602 9.04199 7.74935 9.04199 18.0827V37.6643C11.0053 35.9335 13.5887 34.8743 16.4045 34.8743H50.3753C51.7962 34.8743 52.9587 33.7118 52.9587 32.291V18.0827C52.9587 7.74935 50.3753 5.16602 40.042 5.16602ZM33.5837 27.7702H20.667C19.6078 27.7702 18.7295 26.8918 18.7295 25.8327C18.7295 24.7735 19.6078 23.8952 20.667 23.8952H33.5837C34.6428 23.8952 35.5212 24.7735 35.5212 25.8327C35.5212 26.8918 34.6428 27.7702 33.5837 27.7702ZM41.3337 18.7285H20.667C19.6078 18.7285 18.7295 17.8502 18.7295 16.791C18.7295 15.7318 19.6078 14.8535 20.667 14.8535H41.3337C42.3928 14.8535 43.2712 15.7318 43.2712 16.791C43.2712 17.8502 42.3928 18.7285 41.3337 18.7285Z"
                                            fill="#D8B068"
                                        />
                                    </svg>
                                </div>
                                <div className={styles["resume-banner__text"]}>
                                    <h4 className={styles["resume-banner__module-title"]}>
                                        {activeModuleTitle}
                                    </h4>
                                    <p className={styles["resume-banner__lesson-title"]}>
                                        {activeLessonTitle}
                                    </p>
                                </div>
                            </div>

                            <Link
                                href={resumeLessonHref}
                                className={styles["resume-banner__play-btn"]}
                                aria-label="Play Lesson"
                            >
                                <svg
                                    width="42"
                                    height="42"
                                    viewBox="0 0 42 42"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M4.74289 29.7847L7.78789 23.6946C8.62789 21.9971 8.62789 20.0196 7.78789 18.3221L4.74289 12.2146C2.13539 6.99965 7.75289 1.48715 12.9154 4.21715L15.6104 5.65215C15.9954 5.84465 16.2929 6.15965 16.4504 6.54465L26.4079 28.6821C26.8104 29.5921 26.4429 30.6597 25.5679 31.1147L12.8979 37.7822C7.75289 40.5122 2.13539 34.9997 4.74289 29.7847Z"
                                        fill="#F09E1C"
                                    />
                                    <path
                                        d="M28.5422 27.2998L22.0147 12.8098C21.2797 11.1823 23.0297 9.5373 24.6047 10.3773L34.7022 15.6973C38.9897 17.9548 38.9897 24.0798 34.7022 26.3373L31.1322 28.2098C30.1697 28.6998 28.9972 28.2973 28.5422 27.2998Z"
                                        fill="#F09E1C"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Module Progress Cards */}
                    <div className={styles["modules-list"]}>
                        {displayModules.map((mod) => {
                            const badgeOffset = badgeCircumference * (1 - mod.progress / 100);
                            return (
                                <div key={mod.id} className={styles["module-card"]}>
                                    <div className={styles["module-card__left"]}>
                                        <div className={styles["module-icon-box"]}>
                                            <svg
                                                width="44"
                                                height="44"
                                                viewBox="0 0 62 62"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M52.9587 41.3333V47.7917C52.9587 52.7775 48.9028 56.8333 43.917 56.8333H18.0837C13.0978 56.8333 9.04199 52.7775 9.04199 47.7917V46.1125C9.04199 42.0567 12.3487 38.75 16.4045 38.75H50.3753C51.7962 38.75 52.9587 39.9125 52.9587 41.3333Z"
                                                    fill="#D8B068"
                                                />
                                                <path
                                                    d="M40.042 5.16602H21.9587C11.6253 5.16602 9.04199 7.74935 9.04199 18.0827V37.6643C11.0053 35.9335 13.5887 34.8743 16.4045 34.8743H50.3753C51.7962 34.8743 52.9587 33.7118 52.9587 32.291V18.0827C52.9587 7.74935 50.3753 5.16602 40.042 5.16602ZM33.5837 27.7702H20.667C19.6078 27.7702 18.7295 26.8918 18.7295 25.8327C18.7295 24.7735 19.6078 23.8952 20.667 23.8952H33.5837C34.6428 23.8952 35.5212 24.7735 35.5212 25.8327C35.5212 26.8918 34.6428 27.7702 33.5837 27.7702ZM41.3337 18.7285H20.667C19.6078 18.7285 18.7295 17.8502 18.7295 16.791C18.7295 15.7318 19.6078 14.8535 20.667 14.8535H41.3337C42.3928 14.8535 43.2712 15.7318 43.2712 16.791C43.2712 17.8502 42.3928 18.7285 41.3337 18.7285Z"
                                                    fill="#D8B068"
                                                />
                                            </svg>
                                        </div>
                                        <div className={styles["module-card__info"]}>
                                            <h3 className={styles["module-card__title"]}>
                                                {mod.title}
                                            </h3>
                                            <p className={styles["module-card__meta"]}>
                                                {mod.lessonsCount} lessons{" "}
                                                <span className={styles["meta-bullet"]}>•</span>{" "}
                                                {mod.duration}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Circular Progress Badge */}
                                    <div className={styles["module-badge"]}>
                                        <svg
                                            className={styles["module-badge__svg"]}
                                            viewBox="0 0 56 56"
                                        >
                                            <circle
                                                className={styles["module-badge__track"]}
                                                cx="28"
                                                cy="28"
                                                r="23"
                                            />
                                            {mod.progress > 0 && (
                                                <circle
                                                    className={styles["module-badge__fill"]}
                                                    cx="28"
                                                    cy="28"
                                                    r="23"
                                                    strokeDasharray={badgeCircumference}
                                                    strokeDashoffset={badgeOffset}
                                                />
                                            )}
                                        </svg>
                                        <span className={styles["module-badge__text"]}>
                                            {mod.progress}%
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
