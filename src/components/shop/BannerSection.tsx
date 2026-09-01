"use client";

import { usePathname } from 'next/navigation';
import styles from '@/styles/shop/BannerSection.module.css';

interface BannerSectionProps {
    noMarginTop?: boolean;
    isDashboard?: boolean;
}

export default function BannerSection({ noMarginTop, isDashboard }: BannerSectionProps = {}) {
    const pathname = usePathname();
    const autoDashboard = pathname?.startsWith('/dashboard');
    const isNoMargin = noMarginTop || isDashboard || autoDashboard;

    return (
        <section className={`${styles["shop-banner"]} ${isNoMargin ? styles["shop-banner--no-margin"] : ""}`}>
            <div className={styles["shop-banner__wrapper"]}>
                <div className={styles["shop-banner__content"]}>
                    <h1 className={styles["shop-banner__title"]}>
                        Premium Skincare Professional Results
                    </h1>
                    <p className={styles["shop-banner__description"]}>
                        Discover carefully selected professional skincare and beauty products designed to support effective treatments, elevate your routine, and deliver results you can trust.
                    </p>
                </div>
            </div>
            <div className={styles["shop-banner__image-wrapper"]}>
                <img
                    src="/images/banner_product.jpg"
                    alt="Premium Skincare Professional Results"
                    className={styles["shop-banner__image"]}
                />
            </div>
        </section>
    );
}
