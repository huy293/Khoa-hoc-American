"use client";

import React, { useState } from "react";
import styles from "@/styles/dashboard/courses/LearningContent.module.css";

export interface LessonItem {
    id: string;
    number: number;
    title: string;
    videosCount: number;
    exercisesCount: number;
    duration: string;
    status: "completed" | "in_progress" | "pending";
}

export interface CourseModuleData {
    id: string;
    title: string;
    lessonsCount: number;
    duration: string;
    lessons: LessonItem[];
}

const defaultCourseModules: CourseModuleData[] = [
    {
        id: "mod-1",
        title: "Module 01: Theory",
        lessonsCount: 5,
        duration: "1 lesson/45 min",
        lessons: [
            {
                id: "m1-l1",
                number: 1,
                title: "Introduction to HydraFacial Technology",
                videosCount: 2,
                exercisesCount: 1,
                duration: "45 min",
                status: "completed",
            },
            {
                id: "m1-l2",
                number: 2,
                title: "Skin Anatomy & Skin Types",
                videosCount: 2,
                exercisesCount: 1,
                duration: "45 min",
                status: "completed",
            },
            {
                id: "m1-l3",
                number: 3,
                title: "How the HydraFacial System Works",
                videosCount: 2,
                exercisesCount: 1,
                duration: "45 min",
                status: "completed",
            },
            {
                id: "m1-l4",
                number: 4,
                title: "Understanding HydraFacial Tips",
                videosCount: 2,
                exercisesCount: 1,
                duration: "45 min",
                status: "completed",
            },
            {
                id: "m1-l5",
                number: 5,
                title: "Serums & Active Ingredients",
                videosCount: 2,
                exercisesCount: 1,
                duration: "45 min",
                status: "completed",
            },
        ],
    },
    {
        id: "mod-2",
        title: "Module 02: Professional Practice",
        lessonsCount: 4,
        duration: "1 lesson/45 min",
        lessons: [
            {
                id: "m2-l1",
                number: 1,
                title: "Introduction to HydraFacial Technology",
                videosCount: 2,
                exercisesCount: 1,
                duration: "45 min",
                status: "completed",
            },
            {
                id: "m2-l2",
                number: 2,
                title: "Skin Anatomy & Skin Types",
                videosCount: 2,
                exercisesCount: 1,
                duration: "45 min",
                status: "completed",
            },
            {
                id: "m2-l3",
                number: 3,
                title: "How the HydraFacial System Works",
                videosCount: 2,
                exercisesCount: 1,
                duration: "45 min",
                status: "completed",
            },
            {
                id: "m2-l4",
                number: 4,
                title: "Understanding HydraFacial Tips",
                videosCount: 2,
                exercisesCount: 1,
                duration: "45 min",
                status: "completed",
            },
            {
                id: "m2-l5",
                number: 5,
                title: "Serums & Active Ingredients",
                videosCount: 2,
                exercisesCount: 1,
                duration: "45 min",
                status: "in_progress",
            },
        ],
    },
    {
        id: "mod-3",
        title: "Module 03: Advanced Applications",
        lessonsCount: 4,
        duration: "1 lesson/45 min",
        lessons: [
            {
                id: "m3-l1",
                number: 1,
                title: "Introduction to HydraFacial Technology",
                videosCount: 2,
                exercisesCount: 1,
                duration: "45 min",
                status: "pending",
            },
            {
                id: "m3-l2",
                number: 2,
                title: "Skin Anatomy & Skin Types",
                videosCount: 2,
                exercisesCount: 1,
                duration: "45 min",
                status: "pending",
            },
            {
                id: "m3-l3",
                number: 3,
                title: "How the HydraFacial System Works",
                videosCount: 2,
                exercisesCount: 1,
                duration: "45 min",
                status: "pending",
            },
            {
                id: "m3-l4",
                number: 4,
                title: "Understanding HydraFacial Tips",
                videosCount: 2,
                exercisesCount: 1,
                duration: "45 min",
                status: "pending",
            },
            {
                id: "m3-l5",
                number: 5,
                title: "Serums & Active Ingredients",
                videosCount: 2,
                exercisesCount: 1,
                duration: "45 min",
                status: "pending",
            },
        ],
    },
    {
        id: "mod-4",
        title: "Module 04: Business",
        lessonsCount: 4,
        duration: "1 lesson/45 min",
        lessons: [
            {
                id: "m4-l1",
                number: 1,
                title: "Treatment Pricing & Package Design",
                videosCount: 2,
                exercisesCount: 1,
                duration: "45 min",
                status: "pending",
            },
            {
                id: "m4-l2",
                number: 2,
                title: "Client Retention Strategies",
                videosCount: 2,
                exercisesCount: 1,
                duration: "45 min",
                status: "pending",
            },
            {
                id: "m4-l3",
                number: 3,
                title: "Marketing Your HydraFacial Services",
                videosCount: 2,
                exercisesCount: 1,
                duration: "45 min",
                status: "pending",
            },
            {
                id: "m4-l4",
                number: 4,
                title: "Hygiene & Equipment Maintenance",
                videosCount: 2,
                exercisesCount: 1,
                duration: "45 min",
                status: "pending",
            },
        ],
    },
];

export interface LearningContentProps {
    tag?: string;
    title?: string;
    modules?: CourseModuleData[];
}

export default function LearningContent({
    tag = "LESSONS LIST",
    title = "Let's explore the course together!",
    modules = defaultCourseModules,
}: LearningContentProps) {
    // Default open modules 1, 2, 3 as shown in Figma screenshot
    const [openModules, setOpenModules] = useState<string[]>([
        "mod-1",
        "mod-2",
        "mod-3",
    ]);

    const toggleModule = (moduleId: string) => {
        setOpenModules((prev) =>
            prev.includes(moduleId)
                ? prev.filter((id) => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    return (
        <section className={styles["learning-content"]}>
            <div className={styles["learning-content__container"]}>
                {/* 1. Section Header: Tag & Title */}
                <div className={styles["learning-content__header"]}>
                    <div className={styles["learning-content__tag-wrap"]}>
                        <span className={styles["learning-content__tag"]}>{tag}</span>
                    </div>
                    <div className={styles["learning-content__tag-line"]} />
                    <h2 className={styles["learning-content__title"]}>{title}</h2>
                </div>

                {/* 2. Modules Accordion */}
                <div className={styles["modules-accordion"]}>
                    {modules.map((mod) => {
                        const isOpen = openModules.includes(mod.id);
                        return (
                            <div key={mod.id} className={styles["accordion-item"]}>
                                {/* Header Bar */}
                                <button
                                    type="button"
                                    onClick={() => toggleModule(mod.id)}
                                    className={`${styles["accordion-header"]} ${
                                        isOpen ? styles["accordion-header--open"] : ""
                                    }`}
                                    aria-expanded={isOpen}
                                >
                                    <div className={styles["accordion-header__left"]}>
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
                                        <div className={styles["accordion-header__info"]}>
                                            <h3 className={styles["accordion-header__title"]}>
                                                {mod.title}
                                            </h3>
                                            <p className={styles["accordion-header__meta"]}>
                                                {mod.lessonsCount} lessons{" "}
                                                <span className={styles["meta-bullet"]}>•</span>{" "}
                                                {mod.duration}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Arrow Chevron */}
                                    <div
                                        className={`${styles["accordion-header__chevron"]} ${
                                            isOpen ? styles["accordion-header__chevron--open"] : ""
                                        }`}
                                    >
                                        <svg
                                            width="42"
                                            height="42"
                                            viewBox="0 0 42 42"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M10.5 26.25L21 15.75L31.5 26.25"
                                                stroke="#848484"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </button>

                                {/* Lessons Body */}
                                {isOpen && (
                                    <div className={styles["lessons-list"]}>
                                        {mod.lessons.map((lesson) => {
                                            const isCompleted = lesson.status === "completed";
                                            return (
                                                <div
                                                    key={lesson.id}
                                                    className={styles["lesson-item"]}
                                                >
                                                    <div className={styles["lesson-item__left"]}>
                                                        {/* Badge number */}
                                                        <span
                                                            className={`${styles["lesson-badge"]} ${
                                                                isCompleted
                                                                    ? styles["lesson-badge--completed"]
                                                                    : styles["lesson-badge--pending"]
                                                            }`}
                                                        >
                                                            {lesson.number}
                                                        </span>
                                                        <div className={styles["lesson-item__info"]}>
                                                            <h4 className={styles["lesson-item__title"]}>
                                                                {lesson.title}
                                                            </h4>
                                                            <p className={styles["lesson-item__meta"]}>
                                                                {lesson.videosCount} videos{" "}
                                                                <span className={styles["meta-bullet"]}>•</span>{" "}
                                                                {lesson.exercisesCount} exercise{" "}
                                                                <span className={styles["meta-bullet"]}>•</span>{" "}
                                                                {lesson.duration}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Right Action / Status Icon */}
                                                    <div className={styles["lesson-item__right"]}>
                                                        {isCompleted ? (
                                                            <div
                                                                className={styles["lesson-icon--checked"]}
                                                                aria-label="Completed"
                                                            >
                                                                <svg
                                                                    width="42"
                                                                    height="42"
                                                                    viewBox="0 0 42 42"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path
                                                                        d="M37.1875 16.012C33.145 9.65945 27.23 6.00195 21 6.00195C17.885 6.00195 14.8575 6.91195 12.0925 8.60945C9.3275 10.3245 6.8425 12.827 4.8125 16.012C3.0625 18.7595 3.0625 23.222 4.8125 25.9695C8.855 32.3395 14.77 35.9795 21 35.9795C24.115 35.9795 27.1425 35.0695 29.9075 33.372C32.6725 31.657 35.1575 29.1545 37.1875 25.9695C38.9375 23.2395 38.9375 18.7595 37.1875 16.012ZM21 28.0695C17.08 28.0695 13.93 24.902 13.93 20.9995C13.93 17.097 17.08 13.9295 21 13.9295C24.92 13.9295 28.07 17.097 28.07 20.9995C28.07 24.902 24.92 28.0695 21 28.0695Z"
                                                                        fill="#CFC3AF"
                                                                    />
                                                                    <path
                                                                        d="M21.0002 15.9941C18.2527 15.9941 16.0127 18.2341 16.0127 20.9991C16.0127 23.7466 18.2527 25.9866 21.0002 25.9866C23.7477 25.9866 26.0052 23.7466 26.0052 20.9991C26.0052 18.2516 23.7477 15.9941 21.0002 15.9941Z"
                                                                        fill="#CFC3AF"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className={styles["lesson-icon--play"]}
                                                                aria-label="Play Lesson"
                                                            >
                                                                <svg
                                                                    width="42"
                                                                    height="42"
                                                                    viewBox="0 0 42 42"
                                                                    fill="none"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <g clipPath="url(#clip0_933_9033)">
                                                                        <path
                                                                            d="M4.74289 29.7847L7.78789 23.6946C8.62789 21.9971 8.62789 20.0196 7.78789 18.3221L4.74289 12.2146C2.13539 6.99965 7.75289 1.48715 12.9154 4.21715L15.6104 5.65215C15.9954 5.84465 16.2929 6.15965 16.4504 6.54465L26.4079 28.6821C26.8104 29.5921 26.4429 30.6597 25.5679 31.1147L12.8979 37.7822C7.75289 40.5122 2.13539 34.9997 4.74289 29.7847Z"
                                                                            fill="#F09E1C"
                                                                        />
                                                                        <path
                                                                            d="M28.5422 27.2998L22.0147 12.8098C21.2797 11.1823 23.0297 9.5373 24.6047 10.3773L34.7022 15.6973C38.9897 17.9548 38.9897 24.0798 34.7022 26.3373L31.1322 28.2098C30.1697 28.6998 28.9972 28.2973 28.5422 27.2998Z"
                                                                            fill="#F09E1C"
                                                                        />
                                                                    </g>
                                                                    <defs>
                                                                        <clipPath id="clip0_933_9033">
                                                                            <rect width="42" height="42" fill="white" />
                                                                        </clipPath>
                                                                    </defs>
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
