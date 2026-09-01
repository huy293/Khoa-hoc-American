'use client';

import React from 'react';
import styles from '@/styles/card/ResourceBlogCard.module.css';

export interface ResourceBlogAuthor {
    name: string;
    avatar: string;
    date: string;
}

export interface ResourceBlogCardProps {
    image: string;
    imageAlt?: string;
    title: string;
    description: string;
    author: ResourceBlogAuthor;
    readTime?: string;
    onShare?: () => void;
    onWishlist?: () => void;
    onDownload?: () => void;
    isLiked?: boolean;
    className?: string;
}

export const ResourceBlogCard: React.FC<ResourceBlogCardProps> = ({
    image,
    imageAlt = '5 HydraFacial Techniques',
    title,
    description,
    author,
    readTime = '1 min read',
    onShare,
    onWishlist,
    onDownload,
    isLiked = false,
    className = '',
}) => {
    return (
        <article className={`${styles['resources-blog__card']} ${className}`.trim()}>
            {/* Card Media & Floating Actions */}
            <div className={styles['resources-blog__card-media']}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    className={styles['resources-blog__card-image']}
                    src={image}
                    alt={imageAlt}
                />
                <div className={styles['resources-blog__card-actions']}>
                    <button
                        type="button"
                        className={styles['resources-blog__action-btn']}
                        aria-label="Share"
                        onClick={onShare}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M4 18c1.5-5 5.5-8.5 10.5-8.5V4l8 8-8 8v-5.5C10 14.5 6.5 16 4 18z" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        className={styles['resources-blog__action-btn']}
                        aria-label="Wishlist"
                        onClick={onWishlist}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill={isLiked ? '#C28200' : 'none'}
                            stroke={isLiked ? '#C28200' : 'currentColor'}
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Card Body */}
            <div className={styles['resources-blog__card-body']}>
                <h3 className={styles['resources-blog__card-title']}>{title}</h3>
                <p className={styles['resources-blog__card-desc']}>{description}</p>
                <hr className={styles['resources-blog__card-divider']} />

                {/* Card Footer (Author & Download / Read Time) */}
                <div className={styles['resources-blog__card-footer']}>
                    <div className={styles['resources-blog__author']}>
                        <div className={styles['resources-blog__author-avatar']}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                className={styles['resources-blog__author-avatar-img']}
                                src={author.avatar}
                                alt={author.name}
                            />
                        </div>
                        <div className={styles['resources-blog__author-info']}>
                            <p className={styles['resources-blog__author-name']}>
                                {author.name}
                            </p>
                            <p className={styles['resources-blog__author-date']}>
                                {author.date}
                            </p>
                        </div>
                    </div>
                    {onDownload ? (
                        <button
                            type="button"
                            className={styles['resources-blog__download-btn']}
                            aria-label="Download Resource"
                            onClick={onDownload}
                            title="Download Resource"
                        >
                            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="42" height="42" rx="21" fill="#FFF6E3" />
                                <path
                                    d="M21 24V12M26 19L21 24L16 19M30 24V28C30 28.5304 29.7893 29.0391 29.4142 29.4142C29.0391 29.7893 28.5304 30 28 30H14C13.4696 30 12.9609 29.7893 12.5858 29.4142C12.2107 29.0391 12 28.5304 12 28V24"
                                    stroke="#996100"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    ) : (
                        readTime && (
                            <p className={styles['resources-blog__read-time']}>{readTime}</p>
                        )
                    )}
                </div>
            </div>
        </article>
    );
};

export default ResourceBlogCard;
