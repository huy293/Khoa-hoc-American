import React from 'react';
import styles from '@/styles/common/HeaderText.module.css';

export interface HeaderTextProps {
    eyebrow?: React.ReactNode;
    divider?: boolean | React.ReactNode;
    dividerClassName?: string;
    title?: React.ReactNode;
    children?: React.ReactNode;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    className?: string;
    eyebrowClassName?: string;
    titleClassName?: string;
}

export default function HeaderText({
    eyebrow = 'OUR IMPACT',
    divider = true,
    dividerClassName = '',
    title,
    children,
    as: HeadingTag = 'h2',
    className = '',
    eyebrowClassName = '',
    titleClassName = '',
}: HeaderTextProps) {
    const headingContent = title || children;

    return (
        <div className={`${styles['header-text']} ${className}`.trim()}>
            {eyebrow && (
                <p className={`${styles['header-text__eyebrow']} ${eyebrowClassName}`.trim()}>
                    {eyebrow}
                </p>
            )}
            {divider && (
                <div className={`${styles['header-text__divider']} ${dividerClassName}`.trim()}>
                    {divider !== true ? divider : null}
                </div>
            )}
            {headingContent && (
                <HeadingTag className={`${styles['header-text__title']} ${titleClassName}`.trim()}>
                    {headingContent}
                </HeadingTag>
            )}
        </div>
    );
}
