"use client";

import { useState } from "react";
import ProductCard, { Product } from "@/components/shop/ProductCard";
import styles from "@/styles/shop/ShopSection.module.css";

interface ShopSectionProps {
    products?: Product[];
    onOpenFilter?: () => void;
    onQuickView?: (product: Product) => void;
}

export default function ShopSection({
    products = [],
    onOpenFilter,
    onQuickView,
}: ShopSectionProps) {
    const [visibleCount, setVisibleCount] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const visibleProducts = filteredProducts.slice(0, visibleCount);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 10);
    };

    return (
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
                            <svg
                                className={styles["shop-products__search-icon"]}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="none"
                            >
                                <path
                                    d="M18.75 18.75L14.41 14.41M16.75 8.75C16.75 13.1683 13.1683 16.75 8.75 16.75C4.33172 16.75 0.75 13.1683 0.75 8.75C0.75 4.33172 4.33172 0.75 8.75 0.75C13.1683 0.75 16.75 4.33172 16.75 8.75Z"
                                    stroke="#8A7043"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles["shop-products__search-input"]}
                            />
                        </div>

                        {/* Nút lọc */}
                        <button
                            type="button"
                            className={styles["shop-products__filter-btn"]}
                            onClick={onOpenFilter}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 28 28"
                                fill="none"
                                className={styles["shop-products__filter-icon"]}
                            >
                                <path
                                    d="M24.8501 8.84336H18.3401C17.8851 8.84336 17.5234 8.48169 17.5234 8.02669C17.5234 7.57169 17.8851 7.21002 18.3401 7.21002H24.8501C25.3051 7.21002 25.6668 7.57169 25.6668 8.02669C25.6668 8.48169 25.3051 8.84336 24.8501 8.84336Z"
                                    fill="#82735B"
                                />
                                <path
                                    d="M7.48968 8.84336H3.14967C2.69467 8.84336 2.33301 8.48169 2.33301 8.02669C2.33301 7.57169 2.69467 7.21002 3.14967 7.21002H7.48968C7.94467 7.21002 8.30634 7.57169 8.30634 8.02669C8.30634 8.48169 7.93301 8.84336 7.48968 8.84336Z"
                                    fill="#82735B"
                                />
                                <path
                                    d="M11.83 12.635C14.3751 12.635 16.4383 10.5718 16.4383 8.02667C16.4383 5.48156 14.3751 3.41833 11.83 3.41833C9.2849 3.41833 7.22168 5.48156 7.22168 8.02667C7.22168 10.5718 9.2849 12.635 11.83 12.635Z"
                                    fill="#82735B"
                                />
                                <path
                                    d="M24.85 20.7784H20.51C20.055 20.7784 19.6934 20.4167 19.6934 19.9617C19.6934 19.5067 20.055 19.145 20.51 19.145H24.85C25.305 19.145 25.6667 19.5067 25.6667 19.9617C25.6667 20.4167 25.305 20.7784 24.85 20.7784Z"
                                    fill="#82735B"
                                />
                                <path
                                    d="M9.65967 20.7784H3.14967C2.69467 20.7784 2.33301 20.4167 2.33301 19.9617C2.33301 19.5067 2.69467 19.145 3.14967 19.145H9.65967C10.1147 19.145 10.4763 19.5067 10.4763 19.9617C10.4763 20.4167 10.103 20.7784 9.65967 20.7784Z"
                                    fill="#82735B"
                                />
                                <path
                                    d="M16.1699 24.5817C18.715 24.5817 20.7782 22.5184 20.7782 19.9733C20.7782 17.4282 18.715 15.365 16.1699 15.365C13.6247 15.365 11.5615 17.4282 11.5615 19.9733C11.5615 22.5184 13.6247 24.5817 16.1699 24.5817Z"
                                    fill="#82735B"
                                />
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
                                    onQuickView={onQuickView}
                                />
                            ))}
                        </div>

                        {/* Nút Load More khi còn sản phẩm */}
                        {filteredProducts.length > visibleCount && (
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
    );
}
