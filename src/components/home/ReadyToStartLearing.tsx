import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import styles from '@/styles/home/ReadyToStartLearing.module.css';
import { WPHomeFields } from '@/types/wordpress';

interface ReadyToStartLearingProps {
    data?: Partial<WPHomeFields>;
}

interface LearningItem {
    id: number;
    title: string;
    description: string;
    image: string;
    linkText: string;
    linkUrl: string;
}

export default function ReadyToStartLearing({ data }: ReadyToStartLearingProps = {}) {
    const eyebrow = data?.ready_eyebrow || "READY TO START LEARNING?";
    const title = data?.ready_title || "Find the Beauty Course <br />That Fits Your Craft.";

    const cards: LearningItem[] = (data?.ready_cards && data.ready_cards.length > 0)
        ? data.ready_cards.map((c, idx) => ({
            id: idx + 1,
            title: c.title,
            description: c.description,
            image: typeof c.image === 'string' ? c.image : (c.image?.sourceUrl || "/images/home/shop-professional-supplies.jpg"),
            linkText: c.link_text || "EXPLORE",
            linkUrl: c.link_url || "/shop",
        }))
        : [];

    if (cards.length === 0) return null;
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
                        <p className={styles['ready-to-start-learning__eyebrow']}>{eyebrow}</p>
                        <h2
                            className={styles['ready-to-start-learning__title']}
                            dangerouslySetInnerHTML={{ __html: title }}
                        />
                    </div>

                    {/* Cards Grid */}
                    <div className={styles['ready-to-start-learning__grid']}>
                        {cards.map((item) => (
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