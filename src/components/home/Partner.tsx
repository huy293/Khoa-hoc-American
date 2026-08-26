import styles from '@/styles/home/Partner.module.css';

interface PartnerLogo {
    id: string;
    name: string;
    src: string;
}

const partnerLogos: PartnerLogo[] = [
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

// Hàm nhân bản mảng logo nếu số lượng ít hơn 15
const getDisplayLogos = (items: PartnerLogo[], minCount: number = 15): PartnerLogo[] => {
    if (!items || items.length === 0) return [];
    const repeatCount = Math.ceil(minCount / items.length);
    return Array.from({ length: repeatCount }, () => items).flat();
};

const displayLogos = getDisplayLogos(partnerLogos, 15);

export default function Partner() {
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