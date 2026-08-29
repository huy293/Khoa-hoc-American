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
                            fill="none"
                            stroke="currentColor"
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

                {/* Card Footer (Author & Read Time) */}
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
                    {readTime && (
                        <p className={styles['resources-blog__read-time']}>{readTime}</p>
                    )}
                </div>
            </div>
        </article>
    );
};

export default ResourceBlogCard;
