import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import styles from '@/styles/home/ReadyToStartLearing.module.css';

interface LearningItem {
    id: number;
    title: string;
    description: string;
    image: string;
    linkText: string;
    linkUrl: string;
}

const learningItems: LearningItem[] = [
    {
        id: 1,
        title: "Shop professional supplies",
        description: "Professional skincare, PMU and lash supplies - the same lines we train on.",
        image: "/images/home/shop-professional-supplies.jpg",
        linkText: "VISIT THE SHOP",
        linkUrl: "#",
    },
    {
        id: 2,
        title: "For salons & professionals",
        description: "Continuing education, group certifications, and advanced specialty workshops.",
        image: "/images/home/for-salons-and-professionals.jpg",
        linkText: "TALK TO Admissions",
        linkUrl: "#",
    },
];

export default function ReadyToStartLearing() {
    return (
        <section className={styles['ready-to-start-learning']}>
            <img
                src="/images/home/hand.png"
                alt="ready to start learning"
                className={styles['ready-to-start-learning__hand-img']}
            />
            <div className={styles['ready-to-start-learning__wrapper']}>
                <div className={styles['ready-to-start-learning__container']}>
                    {/* Header: Eyebrow & Title */}
                    <div className={styles['ready-to-start-learning__header']}>
                        <p className={styles['ready-to-start-learning__eyebrow']}>READY TO START LEARNING?</p>
                        <h2 className={styles['ready-to-start-learning__title']}>
                            Find the Beauty Course <br />
                            That Fits Your Craft.
                        </h2>
                    </div>

                    {/* Cards Grid */}
                    <div className={styles['ready-to-start-learning__grid']}>
                        {learningItems.map((item) => (
                            <article key={item.id} className={styles['ready-to-start-learning__card']}>
                                <div className={styles['ready-to-start-learning__card-image-wrapper']}>
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        width={300}
                                        height={300}
                                        className={styles['ready-to-start-learning__card-image']}
                                    />
                                </div>
                                <div className={styles['ready-to-start-learning__card-content']}>
                                    <div className={styles['ready-to-start-learning__card-text']}>
                                        <h3 className={styles['ready-to-start-learning__card-title']}>{item.title}</h3>
                                        <p className={styles['ready-to-start-learning__card-description']}>{item.description}</p>
                                    </div>
                                    <a href={item.linkUrl} className={styles['ready-to-start-learning__card-link']}>
                                        <span>{item.linkText}</span>
                                        <ArrowRight size={16} className={styles['ready-to-start-learning__card-icon']} />
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}