import React from 'react';
import styles from '@/styles/dashboard/DashboardHeadings.module.css';

export interface DashboardHeadingsProps {
    /** Eyebrow tag/badge text (e.g. "COURSES", "MODULES", "RESOURCES") */
    tag?: React.ReactNode;
    /** Main heading text or ReactNode */
    title?: React.ReactNode;
    /** Subtitle / Description text (optional) */
    description?: React.ReactNode;
    /** Alternate title content passed as children */
    children?: React.ReactNode;
    /** Heading level tag, defaults to 'h2' */
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    /** Whether to display the gradient underline divider, defaults to true */
    showLine?: boolean;
    /** Custom divider element if not using default line */
    divider?: React.ReactNode;
    /** Text alignment: 'left' | 'center' | 'right', defaults to 'left' */
    align?: 'left' | 'center' | 'right';
    /** Additional CSS classes for custom overrides */
    className?: string;
    tagWrapClassName?: string;
    tagClassName?: string;
    lineClassName?: string;
    titleClassName?: string;
    descClassName?: string;
}

export default function DashboardHeadings({
    tag,
    title,
    description,
    children,
    as: HeadingTag = 'h2',
    showLine = true,
    divider,
    align = 'left',
    className = '',
    tagWrapClassName = '',
    tagClassName = '',
    lineClassName = '',
    titleClassName = '',
    descClassName = '',
}: DashboardHeadingsProps) {
    const headingContent = title || children;

    const alignClass =
        align === 'center'
            ? styles['dashboard-heading--center']
            : align === 'right'
            ? styles['dashboard-heading--right']
            : '';

    return (
        <div className={`${styles['dashboard-heading']} ${alignClass} ${className}`.trim()}>
            {tag && (
                <div className={`${styles['dashboard-heading__tag-wrap']} ${tagWrapClassName}`.trim()}>
                    <span className={`${styles['dashboard-heading__tag']} ${tagClassName}`.trim()}>
                        {tag}
                    </span>
                </div>
            )}

            {showLine && (
                divider !== undefined ? (
                    divider
                ) : (
                    <div className={`${styles['dashboard-heading__line']} ${lineClassName}`.trim()} />
                )
            )}

            {headingContent && (
                <HeadingTag className={`${styles['dashboard-heading__title']} ${titleClassName}`.trim()}>
                    {headingContent}
                </HeadingTag>
            )}

            {description && (
                <p className={`${styles['dashboard-heading__desc']} ${descClassName}`.trim()}>
                    {description}
                </p>
            )}
        </div>
    );
}

// Alias exports for convenience
export { DashboardHeadings, DashboardHeadings as DashboardHeading };
