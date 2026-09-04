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

/* ── Types & Mock Data ── */
interface ResourceItem {
    id: string;
    image: string;
    title: string;
    description: string;
    author: {
        name: string;
        avatar: string;
        date: string;
    };
}

const TABS = [
    { id: 'all', label: 'ALL COURSE (20)' },
    { id: 'cert', label: 'CERTIFICATE TRAINING (12)' },
    { id: 'laser', label: 'LASER TRAINING COURSES (5)' },
    { id: 'pmu', label: 'P.M.U TRAINING COURSES (3)' },
];

const RESOURCES: ResourceItem[] = [
    {
        id: '1',
        image: '/images/gallery/image-1.jpg',
        title: '5 HydraFacial Techniques Every Esthetician Should Know',
        description: 'Practical advice from experienced beauty educators to help you assess client needs and recommend the right treatment.',
        author: {
            name: 'Thy Anh Pham Nguyen',
            avatar: '/images/thomas-nguyen.png',
            date: 'Dec 28, 2026',
        },
    },
    {
        id: '2',
        image: '/images/gallery/image-2.jpg',
        title: '5 HydraFacial Techniques Every Esthetician Should Know',
        description: 'Practical advice from experienced beauty educators to help you assess client needs and recommend the right treatment.',
        author: {
            name: 'Thy Anh Pham Nguyen',
            avatar: '/images/thomas-nguyen.png',
            date: 'Dec 28, 2026',
        },
    },
    {
        id: '3',
        image: '/images/gallery/image-3.jpg',
        title: '5 HydraFacial Techniques Every Esthetician Should Know',
        description: 'Practical advice from experienced beauty educators to help you assess client needs and recommend the right treatment.',
        author: {
            name: 'Thy Anh Pham Nguyen',
            avatar: '/images/thomas-nguyen.png',
            date: 'Dec 28, 2026',
        },
    },
    {
        id: '4',
        image: '/images/gallery/image-4.jpg',
        title: '5 HydraFacial Techniques Every Esthetician Should Know',
        description: 'Practical advice from experienced beauty educators to help you assess client needs and recommend the right treatment.',
        author: {
            name: 'Thy Anh Pham Nguyen',
            avatar: '/images/thomas-nguyen.png',
            date: 'Dec 28, 2026',
        },
    },
    {
        id: '5',
        image: '/images/gallery/image-5.jpg',
        title: '5 HydraFacial Techniques Every Esthetician Should Know',
        description: 'Practical advice from experienced beauty educators to help you assess client needs and recommend the right treatment.',
        author: {
            name: 'Thy Anh Pham Nguyen',
            avatar: '/images/thomas-nguyen.png',
            date: 'Dec 28, 2026',
        },
    },
    {
        id: '6',
        image: '/images/gallery/image-6.jpg',
        title: '5 HydraFacial Techniques Every Esthetician Should Know',
        description: 'Practical advice from experienced beauty educators to help you assess client needs and recommend the right treatment.',
        author: {
            name: 'Thy Anh Pham Nguyen',
            avatar: '/images/thomas-nguyen.png',
            date: 'Dec 28, 2026',
        },
    },
    {
        id: '7',
        image: '/images/gallery/image-7.jpg',
        title: '5 HydraFacial Techniques Every Esthetician Should Know',
        description: 'Practical advice from experienced beauty educators to help you assess client needs and recommend the right treatment.',
        author: {
            name: 'Thy Anh Pham Nguyen',
            avatar: '/images/thomas-nguyen.png',
            date: 'Dec 28, 2026',
        },
    },
    {
        id: '8',
        image: '/images/gallery/image-8.jpg',
        title: '5 HydraFacial Techniques Every Esthetician Should Know',
        description: 'Practical advice from experienced beauty educators to help you assess client needs and recommend the right treatment.',
        author: {
            name: 'Thy Anh Pham Nguyen',
            avatar: '/images/thomas-nguyen.png',
            date: 'Dec 28, 2026',
        },
    },
];

interface LearningResourcesProps {
    tag?: string;
    title?: string;
    filterTab?: boolean;
    seemore?: boolean;
    limit?: number;
}

export default function LearningResources({
    tag = 'RESOURCES',
    title = 'Learning Resources',
    filterTab = true,
    seemore = true,
    limit = 4,
}: LearningResourcesProps = {}) {
    const pathname = usePathname();
    const resourcesUrl = pathname?.startsWith('/teacher') ? '/teacher/resources' : '/student/resources';
    const [activeTab, setActiveTab] = useState('cert');
    const [likedIds, setLikedIds] = useState<string[]>([]);

    const toggleLike = (id: string) => {
        setLikedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const displayedResources = typeof limit === 'number' ? RESOURCES.slice(0, limit) : RESOURCES;

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
                            {TABS.map((tab) => (
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
