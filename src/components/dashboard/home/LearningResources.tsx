'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/dashboard/home/LearningResources.module.css';
import ResourceBlogCard from '@/components/cards/ResourceBlogCard';
import DashboardHeadings from '@/components/dashboard/DashboardHeadings';

/* ── SVG Icons ── */
const ChevronRightIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

/* ── Types & Interface Definitions ── */
export interface ResourceItem {
    id: string;
    image: string;
    title: string;
    description: string;
    author: {
        name: string;
        avatar: string;
        date: string;
    };
    category?: string;
}

interface LearningResourcesProps {
    tag?: string;
    title?: string;
    filterTab?: boolean;
    seemore?: boolean;
    limit?: number;
    resources?: ResourceItem[];
}

export default function LearningResources({
    tag = 'RESOURCES',
    title = 'Learning Resources',
    filterTab = true,
    seemore = true,
    limit = 4,
    resources = [],
}: LearningResourcesProps = {}) {
    const pathname = usePathname();
    const resourcesUrl = pathname?.startsWith('/teacher') ? '/teacher/resources' : '/student/resources';
    const [activeTab, setActiveTab] = useState('all');
    const [likedIds, setLikedIds] = useState<string[]>([]);

    const toggleLike = (id: string) => {
        setLikedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const tabs = React.useMemo(() => {
        const list = [];
        list.push({ id: 'all', label: `TẤT CẢ (${resources.length})` });
        list.push({ id: 'cert', label: `CHỨNG CHỈ (${resources.filter(r => r.category === 'cert').length})` });
        list.push({ id: 'laser', label: `LASER (${resources.filter(r => r.category === 'laser').length})` });
        list.push({ id: 'pmu', label: `P.M.U (${resources.filter(r => r.category === 'pmu').length})` });
        return list;
    }, [resources]);

    const filteredResources = React.useMemo(() => {
        if (activeTab === 'all') return resources;
        return resources.filter(r => r.category === activeTab);
    }, [resources, activeTab]);

    const displayedResources = typeof limit === 'number' ? filteredResources.slice(0, limit) : filteredResources;

    return (
        <section className={styles['learning-resources']} aria-label="Learning Resources Section">
            {/* 1. Header: Tag & Title */}
            <DashboardHeadings
                tag={tag}
                title={title}
                className={styles['learning-resources__header']}
            />

            {/* 2. Filter Tabs & See more */}
            {(filterTab || seemore) && (
                <div className={styles['learning-resources__nav-row']}>
                    {filterTab ? (
                        <div className={styles['learning-resources__tabs']} role="tablist">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={activeTab === tab.id}
                                    className={`${styles['learning-resources__tab-btn']} ${activeTab === tab.id ? styles['learning-resources__tab-btn--active'] : ''
                                        }`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div />
                    )}

                    {seemore && (
                        <Link href={resourcesUrl} className={styles['learning-resources__see-more']}>
                            <span>See more</span>
                            <ChevronRightIcon />
                        </Link>
                    )}
                </div>
            )}

            {/* 3. Resource Cards Grid */}
            <div className={styles['learning-resources__grid']}>
                {displayedResources.map((resource) => (
                    <ResourceBlogCard
                        key={resource.id}
                        image={resource.image}
                        title={resource.title}
                        description={resource.description}
                        author={resource.author}
                        readTime="1 min read"
                        onShare={() => console.log('Share:', resource.id)}
                        onWishlist={() => toggleLike(resource.id)}
                    />
                ))}
            </div>
        </section>
    );
}
