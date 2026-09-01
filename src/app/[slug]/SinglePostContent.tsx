'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from '@/styles/post/SinglePostContent.module.css';

/* ── SVG Icons Provided by Design ── */
const ShareIcon = () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M25.994 11.6321L17.244 2.88211C17.1217 2.75967 16.9658 2.67625 16.7961 2.64239C16.6264 2.60854 16.4504 2.62578 16.2905 2.69192C16.1306 2.75807 15.9939 2.87016 15.8976 3.01401C15.8014 3.15786 15.75 3.32702 15.7499 3.50008V7.91336C12.9127 8.15618 9.77915 9.54524 7.20118 11.7316C4.09712 14.3654 2.16446 17.7593 1.75868 21.2877C1.72697 21.5621 1.78259 21.8394 1.91763 22.0803C2.05267 22.3211 2.26024 22.5133 2.51081 22.6294C2.76138 22.7454 3.04217 22.7795 3.31323 22.7268C3.58429 22.674 3.83181 22.5371 4.02056 22.3356C5.22368 21.0548 9.50462 17.0046 15.7499 16.6481V21.0001C15.75 21.1731 15.8014 21.3423 15.8976 21.4862C15.9939 21.63 16.1306 21.7421 16.2905 21.8082C16.4504 21.8744 16.6264 21.8916 16.7961 21.8578C16.9658 21.8239 17.1217 21.7405 17.244 21.6181L25.994 12.8681C26.1576 12.704 26.2495 12.4818 26.2495 12.2501C26.2495 12.0184 26.1576 11.7961 25.994 11.6321ZM17.4999 18.8881V15.7501C17.4999 15.518 17.4077 15.2955 17.2437 15.1314C17.0796 14.9673 16.857 14.8751 16.6249 14.8751C13.5537 14.8751 10.5623 15.6768 7.73384 17.2595C6.29331 18.0691 4.95113 19.0424 3.734 20.1601C4.36837 17.5526 5.96743 15.0731 8.33322 13.066C10.8729 10.9124 13.9726 9.62508 16.6249 9.62508C16.857 9.62508 17.0796 9.5329 17.2437 9.3688C17.4077 9.20471 17.4999 8.98215 17.4999 8.75008V5.61321L24.1379 12.2501L17.4999 18.8881Z"
            fill="#8A7043"
        />
    </svg>
);

const HeartIcon = ({ isLiked }: { isLiked: boolean }) => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M19.4688 3.5C17.2102 3.5 15.2327 4.47125 14 6.11297C12.7673 4.47125 10.7898 3.5 8.53125 3.5C6.73337 3.50203 5.00971 4.21713 3.73842 5.48842C2.46713 6.75971 1.75203 8.48337 1.75 10.2812C1.75 17.9375 13.102 24.1347 13.5855 24.3906C13.7129 24.4592 13.8553 24.495 14 24.495C14.1447 24.495 14.2871 24.4592 14.4145 24.3906C14.898 24.1347 26.25 17.9375 26.25 10.2812C26.248 8.48337 25.5329 6.75971 24.2616 5.48842C22.9903 4.21713 21.2666 3.50203 19.4688 3.5ZM14 22.6188C12.0028 21.455 3.5 16.1536 3.5 10.2812C3.50174 8.94741 4.03237 7.6687 4.97554 6.72554C5.9187 5.78237 7.19741 5.25174 8.53125 5.25C10.6586 5.25 12.4447 6.38313 13.1906 8.20312C13.2565 8.36361 13.3687 8.50087 13.5128 8.59747C13.6569 8.69408 13.8265 8.74565 14 8.74565C14.1735 8.74565 14.3431 8.69408 14.4872 8.59747C14.6313 8.50087 14.7435 8.36361 14.8094 8.20312C15.5553 6.37984 17.3414 5.25 19.4688 5.25C20.8026 5.25174 22.0813 5.78237 23.0245 6.72554C23.9676 7.6687 24.4983 8.94741 24.5 10.2812C24.5 16.1448 15.995 21.4539 14 22.6188Z"
            fill={isLiked ? '#E53935' : '#8A7043'}
        />
    </svg>
);

const SendIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M18.3336 10.0001C18.3336 10.079 18.3112 10.1563 18.269 10.223C18.2268 10.2897 18.1665 10.343 18.0951 10.3768L3.0951 17.4601C3.02018 17.4964 2.93607 17.5094 2.85369 17.4973C2.77132 17.4851 2.69449 17.4485 2.6332 17.3922C2.57191 17.3358 2.52898 17.2624 2.51 17.1813C2.49102 17.1002 2.49686 17.0153 2.52677 16.9376L4.8951 10.5818C5.03483 10.2066 5.03483 9.79364 4.8951 9.41845L2.52594 3.06261C2.49588 2.98481 2.48996 2.89976 2.50895 2.81855C2.52794 2.73734 2.57096 2.66373 2.6324 2.60733C2.69384 2.55093 2.77085 2.51435 2.85338 2.50236C2.93592 2.49037 3.02015 2.50352 3.0951 2.54011L18.0951 9.62345C18.1665 9.65719 18.2268 9.71051 18.269 9.77719C18.3112 9.84388 18.3336 9.92118 18.3336 10.0001ZM18.3336 10.0001H5.0001"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const FacebookIcon = () => (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M6.375 2.125H27.625C29.9625 2.125 31.875 4.0375 31.875 6.375V27.625C31.875 29.9625 29.9625 31.875 27.625 31.875H6.375C4.0375 31.875 2.125 29.9625 2.125 27.625V6.375C2.125 4.0375 4.0375 2.125 6.375 2.125Z"
            fill="#C5A670"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.025 17.1062V27.4125C14.025 27.5187 14.1312 27.7312 14.3438 27.7312H18.4875C18.7 27.7312 18.8063 27.625 18.8063 27.4125V17H21.7812C21.8875 17 22.1 16.8937 22.1 16.7875L22.4188 13.6C22.4188 13.3875 22.3125 13.2812 22.1 13.2812H18.8063V11.05C18.8063 10.5187 19.2313 10.0937 19.8688 10.0937H22.2062C22.4187 10.0937 22.525 9.9875 22.525 9.775V6.69375C22.3125 6.48125 22.2063 6.375 21.9938 6.375H18.1688C15.9375 6.375 14.025 8.075 14.025 10.2V13.2812H12.0063C11.7938 13.2812 11.6875 13.3875 11.6875 13.6V16.7875C11.6875 16.8937 11.7938 17.1062 12.0063 17.1062H14.025Z"
            fill="white"
        />
    </svg>
);

const XTwitterIcon = () => (
    <svg width="45" height="22" viewBox="0 0 45 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_1024_16400)">
            <path
                d="M25.2832 9.73866L34.2176 0H32.1004L24.3429 8.45618L18.1468 0H11L20.3694 12.7871L11 23H13.1172L21.3093 14.0696L27.8532 23H35L25.2823 9.73866H25.2832ZM22.3831 12.8998L21.4339 11.6265L13.88 1.49454H17.1323L23.2283 9.67104L24.1776 10.9443L32.1014 21.5731H28.849L22.3831 12.8998Z"
                fill="#C5A670"
            />
        </g>
        <defs>
            <clipPath id="clip0_1024_16400">
                <rect width="45" height="22" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

const LinkedInIcon = () => (
    <svg width="31" height="32" viewBox="0 0 31 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_1024_16402)">
            <path
                d="M28.5956 0H2.31856C1.03047 0 0 1.06667 0 2.31111V29.6889C0 30.9333 1.03047 32 2.31856 32H28.6814C29.9695 32 31 30.9333 31 29.6889V2.31111C30.9141 1.06667 29.8837 0 28.5956 0ZM9.18837 27.2889H4.55125V12H9.10249V27.2889H9.18837ZM6.86981 9.86667C5.40997 9.86667 4.20776 8.62222 4.20776 7.11111C4.20776 5.6 5.40997 4.44444 6.86981 4.44444C8.32964 4.44444 9.53186 5.68889 9.53186 7.2C9.53186 8.71111 8.32964 9.86667 6.86981 9.86667ZM26.3629 27.2889H21.8116V19.8222C21.8116 18.0444 21.8116 15.7333 19.4072 15.7333C17.0028 15.7333 16.6593 17.6889 16.6593 19.6444V27.2H12.0222V12H16.4017V14.0444H16.4875C17.0886 12.8 18.6343 11.5556 20.867 11.5556C25.5042 11.5556 26.3629 14.7556 26.3629 18.8444V27.2889Z"
                fill="#C5A670"
            />
        </g>
        <defs>
            <clipPath id="clip0_1024_16402">
                <rect width="31" height="32" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

const LinkChainIcon = () => (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M15.1898 17.906C15.5785 18.4262 16.0744 18.8566 16.6439 19.1681C17.2134 19.4795 17.8431 19.6647 18.4904 19.7111C19.1377 19.7575 19.7874 19.664 20.3954 19.437C21.0034 19.21 21.5555 18.8547 22.0143 18.3953L24.7296 15.6772C25.554 14.8228 26.0101 13.6785 25.9998 12.4907C25.9895 11.303 25.5136 10.1668 24.6745 9.32684C23.8354 8.48692 22.7004 8.01049 21.5138 8.00017C20.3272 7.98985 19.184 8.44646 18.3305 9.27165L16.7737 10.8209M18.8102 16.094C18.4215 15.5738 17.9256 15.1434 17.3561 14.8319C16.7866 14.5205 16.1569 14.3353 15.5096 14.2889C14.8623 14.2425 14.2126 14.336 13.6046 14.563C12.9966 14.79 12.4445 15.1453 11.9857 15.6047L9.27037 18.3228C8.44601 19.1772 7.98986 20.3215 8.00017 21.5093C8.01048 22.697 8.48643 23.8332 9.3255 24.6732C10.1646 25.5131 11.2996 25.9895 12.4862 25.9998C13.6728 26.0101 14.816 25.5535 15.6695 24.7283L17.2172 23.1791"
            stroke="#C5A670"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const ExpandIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M15 3H21V9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M9 21H3V15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M21 3L14 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M3 21L10 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const CheckMarkIcon = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M16.6667 5L7.50004 14.1667L3.33337 10"
            stroke="#191713"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

/* ── Comments Interface ── */
interface CommentItem {
    id: string;
    author: string;
    avatarColor: string;
    content: string;
    timeAgo: string;
}

const INITIAL_COMMENTS: CommentItem[] = [
    {
        id: 'c1',
        author: 'Dorothy Taylor',
        avatarColor: '#E29B38',
        content:
            'This article was really helpful and easy to understand. I especially liked the practical tips and clear explanations. Looking forward to reading more beauty and skincare insights from Couture Beauty Academy!',
        timeAgo: '2 days',
    },
    {
        id: 'c2',
        author: 'Dorothy Taylor',
        avatarColor: '#E29B38',
        content:
            'This article was really helpful and easy to understand. I especially liked the practical tips and clear explanations. Looking forward to reading more beauty and skincare insights from Couture Beauty Academy!',
        timeAgo: '2 days',
    },
];

const HASHTAGS_LIST = [
    '#estheticianstudent',
    '#beautystudent',
    '#skinstudent',
    '#estheticiantraining',
    '#estheticianschool',
    '#beautyeducation',
    '#futureesthetician',
    '#learnesthetics',
    '#skincarestudent',
    '#beautycareerpath',
    '#facialtrainingschool',
    '#chemicalpeeltraining',
    '#picolaser',
    '#lashlicensetraining',
    '#texaseyelash',
    '#facial',
    '#facialtrainingschool',
    '#estheticianstudent',
];

export default function SinglePostContent() {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith('/dashboard');

    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
    const [newComment, setNewComment] = useState('');
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Toggle Like
    const handleLike = () => {
        setIsLiked((prev) => !prev);
    };

    // Copy Link to clipboard
    const handleCopyLink = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            setToastMessage('Link copied to clipboard!');
            setTimeout(() => setToastMessage(null), 3000);
        }
    };

    // Handle Comment Submission
    const handleSendComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const comment: CommentItem = {
            id: `c-${Date.now()}`,
            author: 'Dorothy Taylor',
            avatarColor: '#E29B38',
            content: newComment.trim(),
            timeAgo: 'Just now',
        };

        setComments([comment, ...comments]);
        setNewComment('');
        setToastMessage('Comment posted successfully!');
        setTimeout(() => setToastMessage(null), 3000);
    };

    return (
        <div
            className={`${styles['single-post']} ${
                isDashboard ? styles['single-post--dashboard'] : ''
            }`}
            aria-label="Single Post Article"
        >
            <div className={styles['single-post__container']}>
                {/* ══════════════════════════════════════════
                   1. Left Column: Main Post Content Card
                   ══════════════════════════════════════════ */}
                <article className={styles['single-post__main-card']}>
                    {/* Top Author & Meta Bar */}
                    <header className={styles['single-post__author-row']}>
                        <div className={styles['single-post__author-info']}>
                            {/* Author Avatar */}
                            <Image
                                src="/images/home/jasmine_lee.jpg"
                                alt="Thy Anh Pham Nguyen"
                                width={38}
                                height={38}
                                className={styles['single-post__author-avatar']}
                            />
                            <div className={styles['single-post__author-text']}>
                                <span className={styles['single-post__author-name']}>
                                    Thy Anh Pham Nguyen
                                </span>
                                <span className={styles['single-post__meta-dot-desktop']}>•</span>
                                <div className={styles['single-post__meta-details']}>
                                    <time dateTime="2026-12-28" className={styles['single-post__meta-text']}>
                                        Dec 28,2026
                                    </time>
                                    <span className={styles['single-post__meta-dot']}>•</span>
                                    <span className={styles['single-post__meta-text']}>
                                        1 min read
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Top Right Action Icons */}
                        <div className={styles['single-post__author-actions']}>
                            <button
                                type="button"
                                className={styles['single-post__action-btn']}
                                onClick={handleCopyLink}
                                title="Share post"
                                aria-label="Share post"
                            >
                                <ShareIcon />
                            </button>
                            <button
                                type="button"
                                className={`${styles['single-post__heart-btn']} ${
                                    isLiked ? styles['single-post__heart-btn--liked'] : ''
                                }`}
                                onClick={handleLike}
                                title={isLiked ? 'Unlike' : 'Like'}
                                aria-label="Like post"
                            >
                                <HeartIcon isLiked={isLiked} />
                            </button>
                        </div>
                    </header>

                    {/* Article Main Body */}
                    <div className={`${styles['single-post__body']} ${styles['chimotbailog']}`}>
                        {/* Title */}
                        <h1 className={styles['single-post__title']}>
                            🎉 NEW YEAR – GRAND OPENING COURSES 2026 🎉
                        </h1>

                        {/* Subtitle / Lead Paragraphs */}
                        <p className={styles['single-post__subtitle']}>
                            ✨ Couture Beauty Academy – Launch Your Beauty Career! ✨
                        </p>
                        <p className={styles['single-post__subtitle-secondary']}>
                            Courses Now Open: Texas Esthetician License
                        </p>

                        {/* Checklist */}
                        <ul className={styles['single-post__checklist']}>
                            <li className={styles['single-post__check-item']}>
                                <span className={styles['single-post__check-icon']}>
                                    <CheckMarkIcon />
                                </span>
                                <span>Lash Extensions Texas license</span>
                            </li>
                            <li className={styles['single-post__check-item']}>
                                <span className={styles['single-post__check-icon']}>
                                    <CheckMarkIcon />
                                </span>
                                <span>Permanent Makeup (PMU) Certification</span>
                            </li>
                            <li className={styles['single-post__check-item']}>
                                <span className={styles['single-post__check-icon']}>
                                    <CheckMarkIcon />
                                </span>
                                <span>Texas Laser Professional</span>
                            </li>
                            <li className={styles['single-post__check-item']}>
                                <span className={styles['single-post__check-icon']}>
                                    <CheckMarkIcon />
                                </span>
                                <span>Laser Tattoo Removal</span>
                            </li>
                        </ul>

                        {/* Banner Graphic with Zoom Trigger */}
                        <div className={styles['single-post__banner-wrapper']}>
                            <Image
                                src="/images/grand_opening_banner.jpg"
                                alt="New Year Grand Opening Courses 2026 - Couture Beauty Academy"
                                width={850}
                                height={480}
                                priority
                                className={styles['single-post__banner-img']}
                            />
                            <button
                                type="button"
                                className={styles['single-post__expand-btn']}
                                onClick={() => setIsLightboxOpen(true)}
                                title="Expand image"
                                aria-label="Expand image fullscreen"
                            >
                                <ExpandIcon />
                            </button>
                        </div>

                        {/* Complete Bonus & Enrollment Sections */}
                        <div className={styles['single-post__bonus-container']}>
                            {/* 1. New Year Bonus Section */}
                            <div className={styles['single-post__section-group']}>
                                <div className={styles['single-post__section-heading']}>
                                    🔥 NEW YEAR BONUS for All Enrollments:
                                </div>
                                <div className={styles['single-post__section-subheading']}>
                                    🎁 $500 Voucher applied to:
                                </div>
                                <ul className={styles['single-post__bullet-list']}>
                                    <li className={styles['single-post__bullet-item']}>
                                        <span className={styles['single-post__bullet-dot']}>•</span>
                                        <span>Lash Extensions</span>
                                    </li>
                                    <li className={styles['single-post__bullet-item']}>
                                        <span className={styles['single-post__bullet-dot']}>•</span>
                                        <span>PMU Course</span>
                                    </li>
                                    <li className={styles['single-post__bullet-item']}>
                                        <span className={styles['single-post__bullet-dot']}>•</span>
                                        <span>Laser Tattoo Removal Training</span>
                                    </li>
                                </ul>
                            </div>

                            {/* 2. Extra Career Services Section */}
                            <div className={styles['single-post__section-group']}>
                                <div className={styles['single-post__section-heading']}>
                                    💎 Extra Career Services:
                                </div>
                                <ul className={styles['single-post__bullet-list']}>
                                    <li className={styles['single-post__bullet-item']}>
                                        <span className={styles['single-post__bullet-dot']}>•</span>
                                        <span>Hands-on practice with live models</span>
                                    </li>
                                    <li className={styles['single-post__bullet-item']}>
                                        <span className={styles['single-post__bullet-dot']}>•</span>
                                        <span>Advanced skin + device training</span>
                                    </li>
                                    <li className={styles['single-post__bullet-item']}>
                                        <span className={styles['single-post__bullet-dot']}>•</span>
                                        <span>Small class, pro techniques, real results</span>
                                    </li>
                                </ul>
                            </div>

                            {/* 3. Limited New Year Gift Section */}
                            <div className={styles['single-post__section-group']}>
                                <div className={styles['single-post__section-heading']}>
                                    💖 Limited New Year Gift:
                                </div>
                                <div className={styles['single-post__section-subheading']}>
                                    💵 $500 Service Voucher for students to use on:
                                </div>
                                <div className={styles['single-post__services-row']}>
                                    <span>✨ Lash Services</span>
                                    <span className={styles['single-post__services-divider']}>|</span>
                                    <span>✨ PMU Services</span>
                                    <span className={styles['single-post__services-divider']}>|</span>
                                    <span>⚡ Laser Tattoo Removal</span>
                                </div>
                            </div>

                            <div className={styles['single-post__text-divider']}>---</div>

                            {/* 4. Contact & Registration Information */}
                            <div className={styles['single-post__contact-info']}>
                                <div className={styles['single-post__contact-title']}>
                                    Register Now!!!
                                </div>
                                <div>
                                    📍 Visit us at: 6441 Westheimer Rd, Houston, TX, United States, Texas
                                </div>
                                <div>
                                    📞 Call us at: +1 832-425-6230
                                </div>
                                <div>
                                    🌐 Website:{' '}
                                    <a
                                        href="https://www.couturebeautyacademy.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles['single-post__contact-link']}
                                    >
                                        https://www.couturebeautyacademy.com/
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Hashtags Section */}
                        <div className={styles['single-post__hashtags-wrapper']}>
                            {HASHTAGS_LIST.map((tag, idx) => (
                                <span key={idx} className={styles['single-post__hashtag']}>
                                    {tag}
                                </span>
                            ))}
                            <span className={styles['single-post__hashtag-text']}>
                                Kathleen Aesthetic Kathleen MinhChau Couture Beauty Academy
                            </span>
                        </div>

                        {/* Bottom Divider Line */}
                        <div className={styles['single-post__footer-divider']} />

                        {/* Bottom Row: Social Icons on Left, Views & Comments on Right */}
                        <div className={styles['single-post__footer-row']}>
                            <div className={styles['single-post__social-icons']}>
                                <button
                                    type="button"
                                    className={styles['single-post__social-btn']}
                                    onClick={() => window.open('https://facebook.com', '_blank')}
                                    title="Share on Facebook"
                                    aria-label="Share on Facebook"
                                >
                                    <FacebookIcon />
                                </button>
                                <button
                                    type="button"
                                    className={styles['single-post__social-btn']}
                                    onClick={() => window.open('https://twitter.com', '_blank')}
                                    title="Share on X"
                                    aria-label="Share on X"
                                >
                                    <XTwitterIcon />
                                </button>
                                <button
                                    type="button"
                                    className={styles['single-post__social-btn']}
                                    onClick={() => window.open('https://linkedin.com', '_blank')}
                                    title="Share on LinkedIn"
                                    aria-label="Share on LinkedIn"
                                >
                                    <LinkedInIcon />
                                </button>
                                <button
                                    type="button"
                                    className={styles['single-post__social-btn']}
                                    onClick={handleCopyLink}
                                    title="Copy link"
                                    aria-label="Copy post link"
                                >
                                    <LinkChainIcon />
                                </button>
                            </div>

                            <div className={styles['single-post__stats']}>
                                <span>21 views</span>
                                <span>{comments.length} comments</span>
                            </div>
                        </div>
                    </div>
                </article>

                {/* ══════════════════════════════════════════
                   2. Right Column: Sidebar (Comments)
                   ══════════════════════════════════════════ */}
                <aside className={styles['single-post__sidebar']} aria-label="Post Comments and Social Sharing">
                    {/* Top Row: Social Icons & Post Stats */}
                    <div className={styles['single-post__sidebar-top']}>
                        <div className={styles['single-post__social-icons']}>
                            <button
                                type="button"
                                className={styles['single-post__social-btn']}
                                onClick={() => window.open('https://facebook.com', '_blank')}
                                title="Share on Facebook"
                                aria-label="Share on Facebook"
                            >
                                <FacebookIcon />
                            </button>
                            <button
                                type="button"
                                className={styles['single-post__social-btn']}
                                onClick={() => window.open('https://twitter.com', '_blank')}
                                title="Share on X"
                                aria-label="Share on X"
                            >
                                <XTwitterIcon />
                            </button>
                            <button
                                type="button"
                                className={styles['single-post__social-btn']}
                                onClick={() => window.open('https://linkedin.com', '_blank')}
                                title="Share on LinkedIn"
                                aria-label="Share on LinkedIn"
                            >
                                <LinkedInIcon />
                            </button>
                            <button
                                type="button"
                                className={styles['single-post__social-btn']}
                                onClick={handleCopyLink}
                                title="Copy link"
                                aria-label="Copy post link"
                            >
                                <LinkChainIcon />
                            </button>
                        </div>

                        {/* Views & Comments Count */}
                        <div className={styles['single-post__stats']}>
                            <span>21 views</span>
                            <span>{comments.length} comments</span>
                        </div>
                    </div>

                    <div className={styles['single-post__sidebar-divider']} />

                    {/* Comments Input Form */}
                    <section className={styles['single-post__comments-section']} aria-label="Add a Comment">
                        <h2 className={styles['single-post__comments-title']}>Comments</h2>
                        <form onSubmit={handleSendComment} className={styles['single-post__comment-box']}>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className={styles['single-post__textarea']}
                                aria-label="Write a comment"
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className={styles['single-post__send-btn']}
                            >
                                <span>Send</span>
                                <SendIcon />
                            </button>
                        </form>

                        {/* All Comments List */}
                        <div className={styles['single-post__all-comments']}>
                            <h3 className={styles['single-post__all-comments-title']}>All Comments</h3>
                            <div className={styles['single-post__comments-list']}>
                                {comments.map((comment) => (
                                    <div key={comment.id} className={styles['single-post__comment-item']}>
                                        <div
                                            className={styles['single-post__comment-avatar']}
                                            style={{ backgroundColor: comment.avatarColor }}
                                        >
                                            {comment.author.charAt(0)}
                                        </div>
                                        <div className={styles['single-post__comment-body']}>
                                            <span className={styles['single-post__comment-name']}>
                                                {comment.author}
                                            </span>
                                            <div className={styles['single-post__comment-bubble']}>
                                                {comment.content}
                                            </div>
                                            <div className={styles['single-post__comment-footer']}>
                                                <span>{comment.timeAgo}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </aside>
            </div>

            {/* ══════════════════════════════════════════
               3. Lightbox Modal for Banner Image
               ══════════════════════════════════════════ */}
            {isLightboxOpen && (
                <div
                    className={styles['lightbox-backdrop']}
                    onClick={() => setIsLightboxOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image Preview Modal"
                >
                    <div className={styles['lightbox-content']} onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className={styles['lightbox-close-btn']}
                            onClick={() => setIsLightboxOpen(false)}
                            aria-label="Close Preview"
                        >
                            ✕
                        </button>
                        <Image
                            src="/images/grand_opening_banner.jpg"
                            alt="New Year Grand Opening Courses 2026"
                            width={1200}
                            height={675}
                            className={styles['lightbox-img']}
                        />
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════
               4. Toast Notification
               ══════════════════════════════════════════ */}
            {toastMessage && (
                <div className={styles['toast']} role="status" aria-live="polite">
                    {toastMessage}
                </div>
            )}
        </div>
    );
}
