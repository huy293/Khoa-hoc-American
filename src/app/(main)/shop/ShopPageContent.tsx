"use client";

import { useState } from "react";
import BannerSection from "@/components/shop/BannerSection";
import ShopSection from "@/components/shop/ShopSection";
import { Product } from "@/components/shop/ProductCard";
import QuickViewProduct from "@/components/shop/QuickViewProduct";
import styles from '@/styles/shop/ShopPageContent.module.css';
import { WPProduct, WPShopFields } from "@/types/wordpress";

interface ShopPageContentProps {
    initialProducts?: WPProduct[];
    bannerData?: Partial<WPShopFields>;
    noMarginTop?: boolean;
    isDashboard?: boolean;
}

export default function ShopPageContent({ initialProducts, bannerData, noMarginTop, isDashboard }: ShopPageContentProps = {}) {
    const isNoMargin = noMarginTop || isDashboard;
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const products: Product[] = (initialProducts || []).map((p, index) => ({
        id: p.databaseId || Number(p.id) || index + 1,
        slug: p.slug,
        name: p.name,
        image: p.image?.sourceUrl || '/images/anh-san-pham.png',
        imageAlt: p.image?.altText || p.name,
        oldPrice: p.regularPrice || '',
        price: p.price || p.salePrice || '$ 0.00',
        description: p.description ? p.description.replace(/<[^>]*>/g, '').trim() : '',
        stock: p.stock ?? 0,
    }));

    return (
        <>
            <BannerSection noMarginTop={isNoMargin} data={bannerData} />
            <ShopSection
                products={products}
                onOpenFilter={() => setIsFilterOpen(true)}
                onQuickView={(prod) => setSelectedProduct(prod)}
            />

            {/* 4. Filter Drawer / Popup Bên Phải */}
            <div className={`${styles["shop-filter-drawer"]} ${isFilterOpen ? styles["shop-filter-drawer--open"] : ""}`}>
                {/* Backdrop mờ phía sau */}
                <div
                    className={styles["shop-filter-drawer__overlay"]}
                    onClick={() => setIsFilterOpen(false)}
                />

                {/* Panel bộ lọc trượt từ bên phải */}
                <div className={styles["shop-filter-drawer__panel"]}>
                    <div className={styles["shop-filter-drawer__header"]}>
                        <h3 className={styles["shop-filter-drawer__title"]}>Filters</h3>
                        <button
                            type="button"
                            className={styles["shop-filter-drawer__close-btn"]}
                            onClick={() => setIsFilterOpen(false)}
                            aria-label="Close filters"
                        >
                            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M36 36 24 24m0 0L12 12m12 12 12-12M24 24 12 36" stroke="#bc9e62" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                    </div>

                    {/* Vùng nội dung bộ lọc */}
                    <div className={styles["shop-filter-drawer__body"]}>
                        <div className={styles["shop-filter-drawer__body__item"]}>
                            <h3 className={styles["shop-filter-drawer__body__item__title"]}>PRODUCTS</h3>
                            <div className={styles["shop-filter-drawer__body__item__content"]}>
                                <label>
                                    <input type="checkbox" name="product" value="product1" />
                                    <span className={styles["shop-filter-drawer__body__item__content__label"]}>Cosmetics</span>
                                </label>
                                <label>
                                    <input type="checkbox" name="product" value="product1" />
                                    <span className={styles["shop-filter-drawer__body__item__content__label"]}>Tattoo machine</span>
                                </label>
                                <label>
                                    <input type="checkbox" name="product" value="product1" />
                                    <span className={styles["shop-filter-drawer__body__item__content__label"]}>Scrub brush</span>
                                </label>
                            </div>
                        </div>
                        <div className={styles["shop-filter-drawer__body__item"]}>
                            <h3 className={styles["shop-filter-drawer__body__item__title"]}>PRICING</h3>
                            <div className={styles["shop-filter-drawer__body__item__content"]}>
                                <div className={styles["shop-filter-drawer__body__item__content__range"]}>
                                    <div className={styles["shop-filter-drawer__price-input-group"]}>
                                        <span className={styles["shop-filter-drawer__price-currency"]}>$</span>
                                        <span className={styles["shop-filter-drawer__price-dash"]}>-</span>
                                        <input
                                            className={styles["shop-filter-drawer__price-input"]}
                                            type="number"
                                            placeholder="min"
                                            min="0"
                                        />
                                    </div>
                                    <span className={styles["shop-filter-drawer__price-separator"]}>—</span>
                                    <div className={styles["shop-filter-drawer__price-input-group"]}>
                                        <span className={styles["shop-filter-drawer__price-currency"]}>$</span>
                                        <span className={styles["shop-filter-drawer__price-dash"]}>-</span>
                                        <input
                                            className={styles["shop-filter-drawer__price-input"]}
                                            type="number"
                                            placeholder="max"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles["shop-filter-drawer__footer"]}>
                        <button className={styles["shop-filter-drawer__reset-btn"]}>RESET</button>
                        <button className={styles["shop-filter-drawer__save-btn"]}>SAVE FILTER</button>
                    </div>
                </div>
            </div>

            {/* 5. Quick View Product Modal */}
            <QuickViewProduct
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </>
    );
}