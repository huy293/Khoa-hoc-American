'use client';

import React, { useState, useMemo } from 'react';
import styles from '@/styles/dashboard/resources/ResourcesContent.module.css';
import DashboardHeadings from '@/components/dashboard/DashboardHeadings';
import ResourceBlogCard from '@/components/cards/ResourceBlogCard';

/* ── SVG Icons ── */
const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
            stroke="#8A7043"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M17.5 17.5L13.875 13.875"
            stroke="#8A7043"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const TabChevronDownIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const LoadMoreChevronIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M11.9995 16.8006C11.2995 16.8006 10.5995 16.5306 10.0695 16.0006L3.54953 9.48062C3.25953 9.19062 3.25953 8.71062 3.54953 8.42063C3.83953 8.13063 4.31953 8.13063 4.60953 8.42063L11.1295 14.9406C11.6095 15.4206 12.3895 15.4206 12.8695 14.9406L19.3895 8.42063C19.6795 8.13063 20.1595 8.13063 20.4495 8.42063C20.7395 8.71062 20.7395 9.19062 20.4495 9.48062L13.9295 16.0006C13.3995 16.5306 12.6995 16.8006 11.9995 16.8006Z"
            fill="#8A7043"
        />
    </svg>
);

/* ── Types & Interface Definitions ── */
interface ResourceItem {
    id: string;
    category: 'all' | 'cert' | 'laser' | 'pmu';
    image: string;
    title: string;
    description: string;
    author: {
        name: string;
        avatar: string;
        date: string;
    };
}

export default function ResourcesContent({
    initialResources = [],
}: {
    initialResources?: ResourceItem[];
}) {
    const allResources = initialResources || [];
    const [activeTab, setActiveTab] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
    const [visibleCount, setVisibleCount] = useState<number>(8);

    const dynamicTabs = useMemo(() => {
        const counts: Record<string, number> = {
            all: allResources.length,
            cert: allResources.filter((r) => r.category === 'cert').length,
            laser: allResources.filter((r) => r.category === 'laser').length,
            pmu: allResources.filter((r) => r.category === 'pmu').length,
        };
        const tabConfigs = [
            'all|ALL COURSE',
            'cert|CERTIFICATE TRAINING',
            'laser|LASER TRAINING COURSES',
            'pmu|P.M.U TRAINING COURSES',
        ];
        return tabConfigs.map((cfg) => {
            const [id, label] = cfg.split('|');
            return { id, label: `${label} (${counts[id] || 0})` };
        });
    }, [allResources]);

    const toggleLike = (id: string) => {
        setLikedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleDownload = (resource: ResourceItem) => {
        // Download document / image trigger
        const link = document.createElement('a');
        link.href = resource.image;
        link.download = `resource-${resource.id}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = (resource: ResourceItem) => {
        if (navigator.share) {
            navigator.share({
                title: resource.title,
                text: resource.description,
                url: window.location.href,
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Đã sao chép liên kết tài nguyên vào bộ nhớ tạm!');
        }
    };

    // Filter by tab & search query
    const filteredResources = useMemo(() => {
        return allResources.filter((res) => {
            const matchesTab = activeTab === 'all' || res.category === activeTab;
            const matchesSearch =
                searchQuery.trim() === '' ||
                res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                res.author.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [activeTab, searchQuery]);

    const displayedResources = filteredResources.slice(0, visibleCount);

    const handleLoadMore = () => {
        setVisibleCount((prev) => Math.min(prev + 4, filteredResources.length));
    };

    return (
        <section className={styles['resources-content']}>
            <div className={styles['resources-content__container']}>
                {/* 1. Header with Reusable DashboardHeadings */}
                <DashboardHeadings
                    tag="RESOURCES"
                    title="Learning Resources"
                    align="left"
                />

                {/* 2. Navigation Row: Filter Tabs & Search Box */}
                <div className={styles['resources-content__nav-row']}>
                    <div className={styles['resources-content__tabs']}>
                        {dynamicTabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setVisibleCount(8);
                                    }}
                                    className={`${styles['resources-content__tab-btn']} ${
                                        isActive ? styles['resources-content__tab-btn--active'] : ''
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    <span className={styles['resources-content__tab-chevron']}>
                                        <TabChevronDownIcon />
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className={styles['resources-content__search-box']}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles['resources-content__search-input']}
                            aria-label="Search learning resources"
                        />
                        <span className={styles['resources-content__search-icon']}>
                            <SearchIcon />
                        </span>
                    </div>
                </div>

                {/* 3. Resource Cards Grid (4 columns, container-responsive) */}
                {displayedResources.length > 0 ? (
                    <div className={styles['resources-content__grid']}>
                        {displayedResources.map((resource) => (
                            <ResourceBlogCard
                                key={resource.id}
                                image={resource.image}
                                title={resource.title}
                                description={resource.description}
                                author={resource.author}
                                isLiked={likedIds.has(resource.id)}
                                onWishlist={() => toggleLike(resource.id)}
                                onShare={() => handleShare(resource)}
                                onDownload={() => handleDownload(resource)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className={styles['resources-content__empty']}>
                        <p>Không tìm thấy tài nguyên nào phù hợp với tìm kiếm của bạn.</p>
                    </div>
                )}

                {/* 4. Load More Button */}
                {visibleCount < filteredResources.length && (
                    <div className={styles['resources-content__load-more-wrap']}>
                        <button
                            type="button"
                            onClick={handleLoadMore}
                            className={styles['resources-content__load-more-btn']}
                        >
                            <span className={styles['resources-content__load-more-icon']}>
                                <LoadMoreChevronIcon />
                            </span>
                            <span>Load more</span>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}