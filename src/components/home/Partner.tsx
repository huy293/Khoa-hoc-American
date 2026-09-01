import styles from '@/styles/home/Partner.module.css';
import { WPPartnerLogo } from '@/types/wordpress';

export interface PartnerProps {
    logos?: WPPartnerLogo[];
}

interface InternalPartnerLogo {
    id: string;
    name: string;
    src: string;
}

const DEFAULT_PARTNER_LOGOS: InternalPartnerLogo[] = [
    {
        id: 'young-nails',
        name: 'Young Nails',
        src: '/images/logos/young-nails.png',
    },
    {
        id: 'perma-blend',
        name: 'Perma Blend',
        src: '/images/logos/perma-blend.png',
    },
    {
        id: 'mehron-makeup',
        name: 'Mehron Makeup',
        src: '/images/logos/mehron-makeup.png',
    },
    {
        id: 'aacs',
        name: 'American Association of Cosmetology Schools',
        src: '/images/logos/aacs.png',
    },
    {
        id: 'quantum-pmu-colors',
        name: 'Quantum PMU Colors',
        src: '/images/logos/quantum-pmu-colors.png',
    },
];

const getDisplayLogos = (items: InternalPartnerLogo[], minCount: number = 15): InternalPartnerLogo[] => {
    if (!items || items.length === 0) return [];
    const repeatCount = Math.ceil(minCount / items.length);
    return Array.from({ length: repeatCount }, () => items).flat();
};

export default function Partner({ logos }: PartnerProps = {}) {
    const rawList: InternalPartnerLogo[] = (logos && logos.length > 0)
        ? logos.map((item, index) => ({
            id: `partner-${index}`,
            name: item.name || `Partner ${index + 1}`,
            src: typeof item.logo === 'string' ? item.logo : (item.logo?.sourceUrl || DEFAULT_PARTNER_LOGOS[index % DEFAULT_PARTNER_LOGOS.length].src),
        }))
        : DEFAULT_PARTNER_LOGOS;

    const displayLogos = getDisplayLogos(rawList, 15);
    return (
        <section className={styles['partner']}>
            <div className={styles['partner__wrapper']}>
                <div className={styles['partner__container']}>
                    <div className={styles['partner__marquee']}>
                        {/* Nơi để xuất tất cả logo, nếu mảng logo ít hơn 15 thì dupliacate đến khi đủ hoặc hơn 15 logo */}
                        <div className={`${styles['partner__track']} ${styles['partner__track--primary']}`}>
                            {displayLogos.map((logo, index) => (
                                <div key={`partner-logo-track1-${index}`} className={styles['partner__item']}>
                                    <img
                                        src={logo.src}
                                        alt={logo.name}
                                        className={styles['partner__logo']}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Nơi để xuất tất cả logo, nếu mảng logo ít hơn 15 thì dupliacate đến khi đủ hoặc hơn 15 logo */}
                        <div
                            className={`${styles['partner__track']} ${styles['partner__track--secondary']}`}
                            aria-hidden="true"
                        >
                            {displayLogos.map((logo, index) => (
                                <div key={`partner-logo-track2-${index}`} className={styles['partner__item']}>
                                    <img
                                        src={logo.src}
                                        alt={logo.name}
                                        className={styles['partner__logo']}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}