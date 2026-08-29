"use client";

import { useState } from "react";
import BannerSection from "@/components/shop/BannerSection";
import ShopSection from "@/components/shop/ShopSection";
import { Product } from "@/components/shop/ProductCard";
import QuickViewProduct from "@/components/shop/QuickViewProduct";
import styles from '@/styles/shop/ShopPageContent.module.css';

const PRODUCTS_DATA: Product[] = [
    {
        id: 1,
        slug: "barrier-repair-salon-size-118ml",
        name: "(Dermalogica) Barrier Repair/ Salon size: 4 oz (118ml) Professional",
        image: "/images/anh-san-pham.png",
        imageAlt: "(Dermalogica) Barrier Repair/ Salon size: 4 oz (118ml) Professional",
        oldPrice: "$ 185.00",
        price: "$ 165.00",
    },
    {
        id: 2,
        slug: "special-cleansing-gel-473ml",
        name: "(Dermalogica) Special Cleansing Gel / Salon size: 16 oz (473ml)",
        image: "/images/anh-san-pham.png",
        imageAlt: "(Dermalogica) Special Cleansing Gel / Salon size: 16 oz (473ml)",
        oldPrice: "$ 140.00",
        price: "$ 120.00",
    },
    {
        id: 3,
        slug: "daily-microfoliant-powder-74g",
        name: "(Dermalogica) Daily Microfoliant / Exfoliating Powder 2.6 oz (74g)",
        image: "/images/anh-san-pham.png",
        imageAlt: "(Dermalogica) Daily Microfoliant / Exfoliating Powder 2.6 oz (74g)",
        oldPrice: "$ 95.00",
        price: "$ 75.00",
    },
    {
        id: 4,
        slug: "skin-smoothing-cream-moisturizer-100ml",
        name: "(Dermalogica) Skin Smoothing Cream / Moisturizer 3.4 oz (100ml)",
        image: "/images/anh-san-pham.png",
        imageAlt: "(Dermalogica) Skin Smoothing Cream / Moisturizer 3.4 oz (100ml)",
        oldPrice: "$ 110.00",
        price: "$ 95.00",
    },
    {
        id: 5,
        slug: "dynamic-skin-recovery-spf50-100ml",
        name: "(Dermalogica) Dynamic Skin Recovery SPF50 / Firming 3.4 oz (100ml)",
        image: "/images/anh-san-pham.png",
        imageAlt: "(Dermalogica) Dynamic Skin Recovery SPF50 / Firming 3.4 oz (100ml)",
        oldPrice: "$ 155.00",
        price: "$ 135.00",
    },
    {
        id: 6,
        slug: "multi-active-toner-250ml",
        name: "(Dermalogica) Multi-Active Toner / Hydrating Mist 8.4 oz (250ml)",
        image: "/images/anh-san-pham.png",
        imageAlt: "(Dermalogica) Multi-Active Toner / Hydrating Mist 8.4 oz (250ml)",
        oldPrice: "$ 68.00",
        price: "$ 55.00",
    },
    {
        id: 7,
        slug: "biolumin-c-serum-59ml",
        name: "(Dermalogica) BioLumin-C Serum / Brightening Vitamin C 2 oz (59ml)",
        image: "/images/anh-san-pham.png",
        imageAlt: "(Dermalogica) BioLumin-C Serum / Brightening Vitamin C 2 oz (59ml)",
        oldPrice: "$ 195.00",
        price: "$ 170.00",
    },
    {
        id: 8,
        slug: "age-bright-clearing-serum-30ml",
        name: "(Dermalogica) Age Bright Clearing Serum / Acne & Aging 1 oz (30ml)",
        image: "/images/anh-san-pham.png",
        imageAlt: "(Dermalogica) Age Bright Clearing Serum / Acne & Aging 1 oz (30ml)",
        oldPrice: "$ 105.00",
        price: "$ 89.00",
    },
    {
        id: 9,
        slug: "precleanse-cleansing-oil-473ml",
        name: "(Dermalogica) PreCleanse / Deep Cleansing Oil 16 oz (473ml)",
        image: "/images/anh-san-pham.png",
        imageAlt: "(Dermalogica) PreCleanse / Deep Cleansing Oil 16 oz (473ml)",
        oldPrice: "$ 135.00",
        price: "$ 115.00",
    },
    {
        id: 10,
        slug: "sound-sleep-cocoon-50ml",
        name: "(Dermalogica) Sound Sleep Cocoon / Night Gel-Cream 1.7 oz (50ml)",
        image: "/images/anh-san-pham.png",
        imageAlt: "(Dermalogica) Sound Sleep Cocoon / Night Gel-Cream 1.7 oz (50ml)",
        oldPrice: "$ 125.00",
        price: "$ 108.00",
    },
    {
        id: 11,
        slug: "calm-water-gel-50ml",
        name: "(Dermalogica) Calm Water Gel / Weightless Water-Gel Moisturizer 1.7 oz (50ml)",
        image: "/images/anh-san-pham.png",
        imageAlt: "(Dermalogica) Calm Water Gel / Weightless Water-Gel Moisturizer 1.7 oz (50ml)",
        oldPrice: "$ 75.00",
        price: "$ 62.00",
    },
    {
        id: 12,
        slug: "sebum-clearing-masque-75ml",
        name: "(Dermalogica) Sebum Clearing Masque / Clay Mask 2.5 oz (75ml)",
        image: "/images/anh-san-pham.png",
        imageAlt: "(Dermalogica) Sebum Clearing Masque / Clay Mask 2.5 oz (75ml)",
        oldPrice: "$ 85.00",
        price: "$ 72.00",
    },
    {
        id: 13,
        slug: "multivitamin-power-recovery-masque-75ml",
        name: "(Dermalogica) MultiVitamin Power Recovery Masque 2.5 oz (75ml)",
        image: "/images/anh-san-pham.png",
        imageAlt: "(Dermalogica) MultiVitamin Power Recovery Masque 2.5 oz (75ml)",
        oldPrice: "$ 90.00",
        price: "$ 78.00",
    },
    {
        id: 14,
        slug: "stress-positive-eye-lift-25ml",
        name: "(Dermalogica) Stress Positive Eye Lift / Brightening Eye Masque 0.85 oz (25ml)",
        image: "/images/anh-san-pham.png",
        imageAlt: "(Dermalogica) Stress Positive Eye Lift / Brightening Eye Masque 0.85 oz (25ml)",
        oldPrice: "$ 115.00",
        price: "$ 98.00",
    },
    {
        id: 15,
        slug: "prisma-protect-spf30-50ml",
        name: "(Dermalogica) Prisma Protect SPF30 / Light-Activated Moisturizer 1.7 oz (50ml)",
        image: "/images/anh-san-pham.png",
        imageAlt: "(Dermalogica) Prisma Protect SPF30 / Light-Activated Moisturizer 1.7 oz (50ml)",
        oldPrice: "$ 110.00",
        price: "$ 94.00",
    },
];

interface ShopPageContentProps {
    noMarginTop?: boolean;
    isDashboard?: boolean;
}

export default function ShopPageContent({ noMarginTop, isDashboard }: ShopPageContentProps = {}) {
    const isNoMargin = noMarginTop || isDashboard;
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    return (
        <>
            <BannerSection noMarginTop={isNoMargin} />
            <ShopSection
                products={PRODUCTS_DATA}
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