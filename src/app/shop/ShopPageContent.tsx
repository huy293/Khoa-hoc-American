"use client";

import { useState } from "react";
import BannerSection from "@/components/shop/BannerSection";
import ProductCard, { Product } from "@/components/shop/ProductCard";
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

export default function ShopPageContent() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [visibleCount, setVisibleCount] = useState(10);

    const visibleProducts = PRODUCTS_DATA.slice(0, visibleCount);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 10);
    };

    return (
        <>
            <BannerSection />
            <section className={styles["shop-products"]}>
                <div className={styles["shop-products__wrapper"]}>
                    <div className={styles["shop-products__container"]}>
                        {/* 1. Header Title */}
                        <div className={styles["shop-products__header"]}>
                            <h2 className={styles["shop-products__title"]}>OUR PRODUCT</h2>
                        </div>

                        {/* 2. Toolbar: Search & Filters */}
                        <div className={styles["shop-products__toolbar"]}>
                            {/* Ô tìm kiếm */}
                            <div className={styles["shop-products__search-box"]}>
                                <svg className={styles["shop-products__search-icon"]} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
                                    <path d="M18.75 18.75L14.41 14.41M16.75 8.75C16.75 13.1683 13.1683 16.75 8.75 16.75C4.33172 16.75 0.75 13.1683 0.75 8.75C0.75 4.33172 4.33172 0.75 8.75 0.75C13.1683 0.75 16.75 4.33172 16.75 8.75Z" stroke="#8A7043" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <input type="text" placeholder="Search..." className={styles["shop-products__search-input"]} />
                            </div>

                            {/* Nút lọc */}
                            <button
                                type="button"
                                className={styles["shop-products__filter-btn"]}
                                onClick={() => setIsFilterOpen(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className={styles['shop-products__filter-icon']}>
                                    <path d="M24.8501 8.84336H18.3401C17.8851 8.84336 17.5234 8.48169 17.5234 8.02669C17.5234 7.57169 17.8851 7.21002 18.3401 7.21002H24.8501C25.3051 7.21002 25.6668 7.57169 25.6668 8.02669C25.6668 8.48169 25.3051 8.84336 24.8501 8.84336Z" fill="#82735B" />
                                    <path d="M7.48968 8.84336H3.14967C2.69467 8.84336 2.33301 8.48169 2.33301 8.02669C2.33301 7.57169 2.69467 7.21002 3.14967 7.21002H7.48968C7.94467 7.21002 8.30634 7.57169 8.30634 8.02669C8.30634 8.48169 7.93301 8.84336 7.48968 8.84336Z" fill="#82735B" />
                                    <path d="M11.83 12.635C14.3751 12.635 16.4383 10.5718 16.4383 8.02667C16.4383 5.48156 14.3751 3.41833 11.83 3.41833C9.2849 3.41833 7.22168 5.48156 7.22168 8.02667C7.22168 10.5718 9.2849 12.635 11.83 12.635Z" fill="#82735B" />
                                    <path d="M24.85 20.7784H20.51C20.055 20.7784 19.6934 20.4167 19.6934 19.9617C19.6934 19.5067 20.055 19.145 20.51 19.145H24.85C25.305 19.145 25.6667 19.5067 25.6667 19.9617C25.6667 20.4167 25.305 20.7784 24.85 20.7784Z" fill="#82735B" />
                                    <path d="M9.65967 20.7784H3.14967C2.69467 20.7784 2.33301 20.4167 2.33301 19.9617C2.33301 19.5067 2.69467 19.145 3.14967 19.145H9.65967C10.1147 19.145 10.4763 19.5067 10.4763 19.9617C10.4763 20.4167 10.103 20.7784 9.65967 20.7784Z" fill="#82735B" />
                                    <path d="M16.1699 24.5817C18.715 24.5817 20.7782 22.5184 20.7782 19.9733C20.7782 17.4282 18.715 15.365 16.1699 15.365C13.6247 15.365 11.5615 17.4282 11.5615 19.9733C11.5615 22.5184 13.6247 24.5817 16.1699 24.5817Z" fill="#82735B" />
                                </svg>
                                <span className={styles["shop-products__filter-text"]}>Filters</span>
                            </button>
                        </div>

                        {/* 3. Products Grid Area */}
                        <div className={styles["shop-products__content"]}>
                            <div className={styles["shop-products__grid"]}>
                                {visibleProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onQuickView={(prod) => setSelectedProduct(prod)}
                                    />
                                ))}
                            </div>

                            {/* Nút Load More khi còn sản phẩm */}
                            {PRODUCTS_DATA.length > visibleCount && (
                                <div className={styles["shop-products__load-more-wrapper"]}>
                                    <button
                                        type="button"
                                        className={styles["shop-products__load-more-btn"]}
                                        onClick={handleLoadMore}
                                    >
                                        <svg
                                            className={styles["shop-products__load-more-icon"]}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M6 9L12 15L18 9"
                                                stroke="#8A7043"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <span>Load more</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

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