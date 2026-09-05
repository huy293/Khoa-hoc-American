'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/teacher/management/ManagamentHeaderDetails.module.css';

/* ── Default Icons ── */
const DefaultChevronLeftIcon = () => (
    <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

/* ── Types & Props ── */
export interface TrainerInfo {
    name: string;
    avatar: string;
    rating?: string | number;
}

export interface ManagamentHeaderDetailsProps {
    /** Tiêu đề khóa học / bài học */
    title?: React.ReactNode;
    /** Mô tả ngắn hoặc nội dung chi tiết */
    description?: React.ReactNode;
    desc?: React.ReactNode;
    /** Đường dẫn quay lại */
    backHref?: string;
    /** Sự kiện khi click nút quay lại (nếu không dùng link) */
    onBackClick?: () => void;
    /** Ẩn / hiện nút quay lại (mặc định: true) */
    showBackButton?: boolean;
    /** Aria label cho nút quay lại */
    backAriaLabel?: string;
    /** Icon tùy chỉnh cho nút quay lại */
    backIcon?: React.ReactNode;
    /** Thông tin giảng viên (Object) */
    trainer?: TrainerInfo;
    /** Tên giảng viên (Flat prop) */
    trainerName?: string;
    /** Ảnh đại diện giảng viên (Flat prop) */
    trainerAvatar?: string;
    /** Đánh giá của giảng viên (Flat prop) */
    trainerRating?: string | number;
    /** Ẩn / hiện khối giảng viên (mặc định: true) */
    showTrainer?: boolean;
    /** Ẩn / hiện rating giảng viên (mặc định: true) */
    showTrainerRating?: boolean;
    /** Icon ngôi sao đánh giá tùy chỉnh */
    starIcon?: React.ReactNode;
    /** Nội dung tùy chỉnh bên phải (thay thế hoặc bổ sung cho khối giảng viên) */
    rightContent?: React.ReactNode;
    /** Thẻ HTML cho tiêu đề (mặc định: 'h1') */
    titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'div';
    /** ClassName tùy chỉnh */
    className?: string;
    /** Style inline tùy chỉnh */
    style?: React.CSSProperties;
}

export default function ManagamentHeaderDetails({
    title = 'INTRODUCTION TO HYDRAFACIAL',
    description,
    desc,
    backHref = '/teacher/management/classroom',
    onBackClick,
    showBackButton = true,
    backAriaLabel = 'Back to classroom management',
    backIcon,
    trainer,
    trainerName,
    trainerAvatar,
    trainerRating,
    showTrainer = true,
    showTrainerRating = true,
    starIcon,
    rightContent,
    titleTag = 'h1',
    className = '',
    style,
}: ManagamentHeaderDetailsProps) {
    // Determine title element
    const TitleHeadingTag = titleTag;

    // Resolve description
    const resolvedDescription =
        description !== undefined
            ? description
            : desc !== undefined
            ? desc
            : '';

    // Resolve trainer information
    const resolvedTrainerName = trainerName || trainer?.name || '';
    const resolvedTrainerAvatar = trainerAvatar || trainer?.avatar || '/images/kathleen.png';
    const resolvedTrainerRating = trainerRating !== undefined ? trainerRating : trainer?.rating || '';

    // Render back button
    const renderBackButton = () => {
        if (!showBackButton) return null;

        const icon = backIcon || <DefaultChevronLeftIcon />;

        if (onBackClick) {
            return (
                <button
                    type="button"
                    onClick={onBackClick}
                    className={styles['header-details__back-btn']}
                    aria-label={backAriaLabel}
                >
                    {icon}
                </button>
            );
        }

        return (
            <Link
                href={backHref}
                className={styles['header-details__back-btn']}
                aria-label={backAriaLabel}
            >
                {icon}
            </Link>
        );
    };

    return (
        <div className={`${styles['header-details']} ${className}`.trim()} style={style}>
            {/* Left Column: Back button, Title & Description */}
            <div className={styles['header-details__left']}>
                <div className={styles['header-details__title-row']}>
                    {renderBackButton()}
                    <TitleHeadingTag className={styles['header-details__title']}>
                        {title}
                    </TitleHeadingTag>
                </div>

                {resolvedDescription && (
                    <p className={styles['header-details__desc']}>{resolvedDescription}</p>
                )}
            </div>

            {/* Right Column: Trainer info or custom right content */}
            {rightContent ? (
                rightContent
            ) : showTrainer ? (
                <div className={styles['header-details__trainer']}>
                    <div className={styles['header-details__trainer-avatar-wrap']}>
                        <Image
                            src={resolvedTrainerAvatar}
                            alt={resolvedTrainerName}
                            width={48}
                            height={48}
                            className={styles['header-details__trainer-avatar']}
                        />
                    </div>
                    <div className={styles['header-details__trainer-info']}>
                        <span className={styles['header-details__trainer-name']}>
                            {resolvedTrainerName}
                        </span>
                        {showTrainerRating && (
                            <div className={styles['header-details__trainer-rating']}>
                                <span className={styles['header-details__star-icon']} aria-hidden="true">
                                    {starIcon || '★'}
                                </span>
                                <span>{resolvedTrainerRating}</span>
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
