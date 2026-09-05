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

const getDisplayLogos = (items: InternalPartnerLogo[], minCount: number = 15): InternalPartnerLogo[] => {
    if (!items || items.length === 0) return [];
    const repeatCount = Math.ceil(minCount / items.length);
    return Array.from({ length: repeatCount }, () => items).flat();
};

export default function Partner({ logos }: PartnerProps = {}) {
    if (!logos || logos.length === 0) return null;

    const rawList: InternalPartnerLogo[] = logos.map((item, index) => ({
        id: `partner-${index}`,
        name: item.name || `Partner ${index + 1}`,
        src: typeof item.logo === 'string' ? item.logo : (item.logo?.sourceUrl || ''),
    })).filter(item => item.src !== '');

    if (rawList.length === 0) return null;

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