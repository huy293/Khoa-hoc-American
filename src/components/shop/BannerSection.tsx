import styles from '@/styles/shop/BannerSection.module.css';
import { WPShopFields } from '@/types/wordpress';

interface BannerSectionProps {
    noMarginTop?: boolean;
    isDashboard?: boolean;
    data?: Partial<WPShopFields>;
}

export default function BannerSection({ noMarginTop, isDashboard, data }: BannerSectionProps = {}) {
    const isNoMargin = noMarginTop || isDashboard;
    const title = data?.shop_banner_title || "Premium Skincare Professional Results";
    const description = data?.shop_banner_description || data?.shop_banner_desc || "Discover carefully selected professional skincare and beauty products designed to support effective treatments, elevate your routine, and deliver results you can trust.";
    const imageSrc = typeof data?.shop_banner_image === 'string' ? data.shop_banner_image : (data?.shop_banner_image?.sourceUrl || "/images/banner_product.jpg");

    return (
        <section className={`${styles["shop-banner"]} ${isNoMargin ? styles["shop-banner--no-margin"] : ""}`}>
            <div className={styles["shop-banner__wrapper"]}>
                <div className={styles["shop-banner__content"]}>
                    <h1
                        className={styles["shop-banner__title"]}
                        dangerouslySetInnerHTML={{ __html: title }}
                    />
                    <p className={styles["shop-banner__description"]}>
                        {description}
                    </p>
                </div>
            </div>
            <div className={styles["shop-banner__image-wrapper"]}>
                <img
                    src={imageSrc}
                    alt="Premium Skincare Professional Results"
                    className={styles["shop-banner__image"]}
                />
            </div>
        </section>
    );
}


