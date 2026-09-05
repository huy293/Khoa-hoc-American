'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import styles from '@/styles/course-detail/CourseDetailHero.module.css';
import { WPCourse } from '@/types/wordpress';

/* ── SVGs ── */
const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={styles['meta-icon']}>
        <path
            d="M10 2V10L13 7L16 10V2M4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2H19C19.2652 2 19.5196 2.10536 19.7071 2.29289C19.8946 2.48043 20 2.73478 20 3V17M4 19.5C4 20.163 4.26339 20.7989 4.73223 21.2678C5.20107 21.7366 5.83696 22 6.5 22H19C19.2652 22 19.5196 21.8946 19.7071 21.7071C19.8946 21.5196 20 21.2652 20 21V17M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20"
            stroke="#563A00"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const ClockMetaIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={styles['meta-icon']}>
        <path
            d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
            stroke="#563A00"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const ClockBannerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
            d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
            stroke="#B56F00"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const LevelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M5 21V15M12 21V9M19 21V3" stroke="#B56F00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const PlaceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
            d="M10 18V11M14 18V11M18 18V11M3 22H21M6 18V11M11.119 2.20501C11.3932 2.07047 11.6946 2.00052 12 2.00052C12.3054 2.00052 12.6068 2.07047 12.881 2.20501L20.721 6.05101C20.8225 6.10076 20.9042 6.18345 20.9527 6.2856C21.0012 6.38774 21.0136 6.5033 20.988 6.61342C20.9623 6.72354 20.9001 6.82171 20.8115 6.89193C20.7229 6.96214 20.6131 7.00024 20.5 7.00001H3.5C3.38702 7.00001 3.27737 6.96175 3.18892 6.89146C3.10047 6.82117 3.03843 6.72299 3.01292 6.61293C2.9874 6.50287 2.99992 6.38741 3.04842 6.28537C3.09692 6.18333 3.17855 6.10072 3.28 6.05101L11.119 2.20501Z"
            stroke="#B56F00"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const RatingOutlineIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
            d="M11.5248 2.29499C11.5687 2.20645 11.6364 2.13192 11.7203 2.07981C11.8042 2.0277 11.9011 2.00009 11.9998 2.00009C12.0986 2.00009 12.1955 2.0277 12.2794 2.07981C12.3633 2.13192 12.431 2.20645 12.4748 2.29499L14.7848 6.97399C14.937 7.28195 15.1617 7.54839 15.4395 7.75044C15.7173 7.95248 16.04 8.0841 16.3798 8.13399L21.5458 8.88999C21.6437 8.90417 21.7357 8.94546 21.8113 9.00918C21.887 9.07291 21.9433 9.15653 21.9739 9.25059C22.0045 9.34465 22.0081 9.44539 21.9844 9.54142C21.9607 9.63745 21.9107 9.72494 21.8398 9.79398L18.1038 13.432C17.8575 13.6721 17.6731 13.9685 17.5667 14.2956C17.4602 14.6228 17.4349 14.9709 17.4928 15.31L18.3748 20.45C18.3921 20.5478 18.3816 20.6485 18.3443 20.7407C18.3071 20.8328 18.2448 20.9126 18.1644 20.971C18.084 21.0294 17.9888 21.064 17.8897 21.0709C17.7906 21.0778 17.6915 21.0567 17.6038 21.01L12.9858 18.582C12.6816 18.4222 12.343 18.3387 11.9993 18.3387C11.6557 18.3387 11.3171 18.4222 11.0128 18.582L6.39585 21.01C6.30818 21.0564 6.20924 21.0773 6.1103 21.0702C6.01135 21.0632 5.91636 21.0285 5.83614 20.9702C5.75592 20.9119 5.69368 20.8322 5.6565 20.7402C5.61933 20.6482 5.6087 20.5477 5.62585 20.45L6.50685 15.311C6.56504 14.9717 6.53983 14.6234 6.43338 14.296C6.32694 13.9687 6.14245 13.6721 5.89585 13.432L2.15985 9.79499C2.08844 9.72602 2.03784 9.63838 2.01381 9.54206C1.98978 9.44574 1.99328 9.3446 2.02393 9.25018C2.05457 9.15575 2.11111 9.07183 2.18712 9.00797C2.26313 8.94411 2.35555 8.90288 2.45385 8.88899L7.61885 8.13399C7.9591 8.08448 8.28224 7.95304 8.56043 7.75097C8.83863 7.5489 9.06355 7.28226 9.21585 6.97399L11.5248 2.29499Z"
            stroke="#B56F00"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const MasterTrainerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
            d="M21.9998 9.99999V16M5.9998 12.5V16C5.9998 16.7956 6.63194 17.5587 7.75716 18.1213C8.88238 18.6839 10.4085 19 11.9998 19C13.5911 19 15.1172 18.6839 16.2424 18.1213C17.3677 17.5587 17.9998 16.7956 17.9998 16V12.5M21.4198 10.922C21.5988 10.843 21.7507 10.7133 21.8567 10.5488C21.9627 10.3843 22.0181 10.1924 22.0161 9.99673C22.0141 9.80108 21.9547 9.61031 21.8454 9.44807C21.736 9.28584 21.5814 9.15925 21.4008 9.08399L12.8298 5.17999C12.5692 5.06114 12.2862 4.99963 11.9998 4.99963C11.7134 4.99963 11.4304 5.06114 11.1698 5.17999L2.5998 9.07999C2.42177 9.15796 2.27031 9.28613 2.16396 9.44881C2.05761 9.61149 2.00098 9.80163 2.00098 9.99599C2.00098 10.1903 2.05761 10.3805 2.16396 10.5432C2.27031 10.7059 2.42177 10.834 2.5998 10.912L11.1698 14.82C11.4304 14.9388 11.7134 15.0003 11.9998 15.0003C12.2862 15.0003 12.5692 14.9388 12.8298 14.82L21.4198 10.922Z"
            stroke="#B56F00"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const StarFilledIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
            d="M10 1L12.5 7.5H19.5L13.8 11.8L16 18.5L10 14.2L4 18.5L6.2 11.8L0.5 7.5H7.5L10 1Z"
            fill="#FF9C00"
        />
    </svg>
);

const ArrowRightIcon = () => (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M1 6H16.5M16.5 6L11.5 1M16.5 6L11.5 11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

interface CourseDetailHeroProps {
    /** Whether user has enrolled/purchased this course (from auth/backend API) */
    isEnrolled?: boolean;
    courseSlug?: string;
    course?: WPCourse | null;
}

export default function CourseDetailHero({
    isEnrolled = false,
    courseSlug = 'hydra-facial',
    course,
}: CourseDetailHeroProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [enrolled, setEnrolled] = useState(isEnrolled);
    const [loading, setLoading] = useState(false);

    // Đồng bộ trạng thái đã đăng ký (từ props hoặc cookie phiên học)
    useEffect(() => {
        if (isEnrolled) {
            setEnrolled(true);
            return;
        }
        if (typeof document !== 'undefined') {
            const match = document.cookie.match(/hn_enrolled_courses=([^;]+)/);
            if (match) {
                try {
                    const list = JSON.parse(decodeURIComponent(match[1]));
                    const currentId = course?.id ? String(course.id) : '';
                    if (Array.isArray(list) && (list.includes(courseSlug) || (currentId && list.includes(currentId)))) {
                        setEnrolled(true);
                    }
                } catch {
                    // ignore
                }
            }
        }
    }, [isEnrolled, courseSlug, course?.id]);

    // Kiểm tra khóa học có phải miễn phí không
    const isFree = useMemo(() => {
        if (!course) return true;
        const cf = course.courseFields;
        const p = cf?.price || (course as any)?.price;
        const rawMetaPrice = (course as any)?.meta?._lp_price;
        if ((course as any)?.is_free === true) return true;
        if (rawMetaPrice === 0 || rawMetaPrice === '0') return true;
        if (!p || p === '' || p === 0 || p === '0') return true;
        if (typeof p === 'string') {
            const clean = p.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
            return clean === '0' || clean === 'free' || clean === 'mienphi' || clean === '';
        }
        return false;
    }, [course]);

    // Xử lý nút Enroll / Registration Now
    const handleEnrollClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (loading) return;

        // 1. Kiểm tra đăng nhập
        const isLoggedIn = typeof document !== 'undefined' &&
            document.cookie.split(';').some(item => item.trim().startsWith('hn_user_session='));

        if (!isLoggedIn) {
            // Chưa đăng nhập -> Chuyển hướng đến /login kèm query redirect để quay lại sau khi login
            const currentPath = pathname || `/courses/${courseSlug}`;
            router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
            return;
        }

        // 2. Đã đăng nhập: Khóa học miễn phí -> tự động enroll bằng LearnPress Headless API
        if (isFree) {
            setLoading(true);
            try {
                const res = await fetch('/api/courses/enroll', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        courseId: course?.id || courseSlug,
                        courseSlug: courseSlug,
                    }),
                });

                const data = await res.json();

                if (!res.ok || !data.success) {
                    if (data.requireLogin) {
                        const currentPath = pathname || `/courses/${courseSlug}`;
                        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
                        return;
                    }
                    alert(data.message || 'Không thể đăng ký khóa học lúc này. Vui lòng thử lại sau.');
                    setLoading(false);
                    return;
                }

                // Enroll thành công -> Cập nhật trạng thái và chuyển đến trang bài học
                setEnrolled(true);
                setTimeout(() => {
                    router.push(data.redirectUrl || `/student/courses/${courseSlug}`);
                }, 500);
            } catch (err) {
                console.error('Enroll error:', err);
                alert('Lỗi kết nối máy chủ. Vui lòng thử lại sau.');
                setLoading(false);
            }
        } else {
            // Khóa học có phí -> Chuyển đến giỏ hàng / checkout
            router.push(`/cart?course=${courseSlug}`);
        }
    };

    const cf = (course?.courseFields || {}) as any;
    const title = course?.title || "HYDRA FACIAL";
    const courseCats = Array.isArray((course as any)?.categories) ? (course as any).categories : (Array.isArray(cf.categories) ? cf.categories : []);
    const firstCat = courseCats[0];
    const category = cf.category || (typeof firstCat === 'string' ? firstCat : (firstCat?.name || 'CERTIFICATE TRAINING'));
    const lessons = cf.lessons || (course?.sections ? `${course.sections.reduce((acc: number, s: any) => acc + (s.items?.length || 0), 0)} lessons` : '') || "12 lessons";
    const duration = cf.duration || "3 weeks";
    const description = cf.subtitle || (course?.excerpt ? course.excerpt.replace(/<[^>]*>/g, '').trim() : '') || "Master professional HydraFacial techniques through theory, hands-on practice, live-model training, and advanced treatment protocols.";
    const rating = cf.rating || "4.9/5.0";
    const traineeCount = cf.traineeCount || "(2.700+ trainee)";
    const trainerName = cf.trainer?.name || "Kathleen trainer";
    const trainerAvatar = cf.trainer?.avatar || "/images/home/kathleen.png";

    return (
        <section className={styles['detail-hero']}>
            <div className={styles['detail-hero__container']}>
                {/* ── Top Header Section (Left: Breadcrumb, Title, Lessons / Right: Description, CTA) ── */}
                <div className={styles['detail-hero__top']}>
                    {/* Left Column */}
                    <div className={styles['detail-hero__left']}>
                        {/* Breadcrumb */}
                        <div className={styles['detail-hero__breadcrumb']}>
                            <Link href="/courses" className={styles['detail-hero__crumb']}>
                                COURSE
                            </Link>
                            <span className={styles['detail-hero__crumb-separator']}>&gt;</span>
                            <span className={styles['detail-hero__crumb']}>
                                {category}
                            </span>
                            <span className={styles['detail-hero__crumb-separator']}>&gt;</span>
                            <span className={styles['detail-hero__crumb-active']}>
                                {title}
                            </span>
                        </div>

                        {/* Main Course Title */}
                        <h1 className={styles['detail-hero__title']}>{title}</h1>

                        {/* Lessons & Duration Meta */}
                        <div className={styles['detail-hero__meta']}>
                            <div className={styles['detail-hero__meta-item']}>
                                <BookIcon />
                                <span>{lessons}</span>
                            </div>
                            <div className={styles['detail-hero__meta-item']}>
                                <ClockMetaIcon />
                                <span>{duration}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className={styles['detail-hero__right']}>
                        <p className={styles['detail-hero__description']}>
                            {description}
                        </p>

                        <div className={styles['detail-hero__actions']}>
                            {/* PREVIEW CLASS: Hidden after purchasing/enrolling in the course */}
                            {!enrolled && (
                                <Link
                                    href="#preview-class"
                                    className={`${styles['detail-hero__btn']} ${styles['detail-hero__btn--primary']}`}
                                >
                                    <span>PREVIEW CLASS</span>
                                    <ArrowRightIcon />
                                </Link>
                            )}

                            {/* REGISTRATION NOW! transforms into CONTINUE THE LESSON after purchase/enroll */}
                            {enrolled ? (
                                <Link
                                    href={`/student/courses/${courseSlug}`}
                                    className={`${styles['detail-hero__btn']} ${styles['detail-hero__btn--secondary']}`}
                                >
                                    <span>CONTINUE THE LESSON</span>
                                    <ArrowRightIcon />
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleEnrollClick}
                                    disabled={loading}
                                    className={`${styles['detail-hero__btn']} ${styles['detail-hero__btn--secondary']}`}
                                    style={{ cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.8 : 1 }}
                                >
                                    <span>{loading ? 'ENROLLING...' : (isFree ? 'ENROLL NOW' : 'REGISTRATION NOW!')}</span>
                                    {!loading && <ArrowRightIcon />}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Bottom 5-Column Course Overview Card Banner ── */}
                <div className={styles['overview-banner']}>
                    {/* 1. Time and date */}
                    <div className={styles['overview-banner__col']}>
                        <div className={styles['overview-banner__header']}>
                            <ClockBannerIcon />
                            <span className={styles['overview-banner__title']}>Time and date</span>
                        </div>
                        <div className={styles['overview-banner__divider']} />
                        <div className={styles['overview-banner__body']}>
                            <p className={styles['overview-banner__text-gray']}>4 hours / 3 weeks</p>
                            <p className={styles['overview-banner__text-gold']}>Start: 25 July, 2026</p>
                        </div>
                    </div>

                    <div className={styles['overview-banner__separator']} />

                    {/* 2. Course level */}
                    <div className={styles['overview-banner__col']}>
                        <div className={styles['overview-banner__header']}>
                            <LevelIcon />
                            <span className={styles['overview-banner__title']}>Course level</span>
                        </div>
                        <div className={styles['overview-banner__divider']} />
                        <div className={styles['overview-banner__body']}>
                            <p className={styles['overview-banner__text-gray']}>Beginner</p>
                            <p className={styles['overview-banner__text-gray']}>Advanced</p>
                        </div>
                    </div>

                    <div className={styles['overview-banner__separator']} />

                    {/* 3. Place */}
                    <div className={styles['overview-banner__col']}>
                        <div className={styles['overview-banner__header']}>
                            <PlaceIcon />
                            <span className={styles['overview-banner__title']}>Place</span>
                        </div>
                        <div className={styles['overview-banner__divider']} />
                        <div className={styles['overview-banner__body']}>
                            <p className={styles['overview-banner__text-gray']}>Onsite</p>
                            <p className={styles['overview-banner__text-gray']}>Online</p>
                        </div>
                    </div>

                    <div className={styles['overview-banner__separator']} />

                    {/* 4. Rating */}
                    <div className={styles['overview-banner__col']}>
                        <div className={styles['overview-banner__header']}>
                            <RatingOutlineIcon />
                            <span className={styles['overview-banner__title']}>Rating</span>
                        </div>
                        <div className={styles['overview-banner__divider']} />
                        <div className={styles['overview-banner__body']}>
                            <div className={styles['overview-banner__rating-score']}>
                                <StarFilledIcon />
                                <span>{rating}</span>
                            </div>
                            <p className={styles['overview-banner__text-trainee']}>{traineeCount}</p>
                        </div>
                    </div>

                    <div className={styles['overview-banner__separator']} />

                    {/* 5. Master Trainer */}
                    <div className={styles['overview-banner__col']}>
                        <div className={styles['overview-banner__header']}>
                            <MasterTrainerIcon />
                            <span className={styles['overview-banner__title']}>Master Trainer</span>
                        </div>
                        <div className={styles['overview-banner__divider']} />
                        <div className={styles['overview-banner__trainer-body']}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={trainerAvatar}
                                alt={trainerName}
                                className={styles['overview-banner__trainer-img']}
                            />
                            <div className={styles['overview-banner__trainer-info']}>
                                <span className={styles['overview-banner__trainer-name']}>
                                    {trainerName}
                                </span>
                                <div className={styles['overview-banner__trainer-stars']}>
                                    <StarFilledIcon />
                                    <span>{rating}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
