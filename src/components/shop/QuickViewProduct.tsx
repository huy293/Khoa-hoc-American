"use client";

import { useState, useEffect } from "react";
import { Product } from "./ProductCard";
import styles from "@/styles/shop/QuickViewProduct.module.css";

export interface QuickViewProductProps {
    product: Product | null;
    onClose: () => void;
}

export default function QuickViewProduct({ product, onClose }: QuickViewProductProps) {
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (product) {
            setQuantity(1);
        }
    }, [product]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (product) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [product, onClose]);

    if (!product) return null;

    return (
        <div className={styles["shop-quickview"]}>
            {/* Backdrop mờ phía sau */}
            <div
                className={styles["shop-quickview__overlay"]}
                onClick={onClose}
            />

            {/* Khung Modal xem nhanh */}
            <div className={styles["shop-quickview__card"]}>
                {/* Header của Popup */}
                <div className={styles["shop-quickview__header"]}>
                    <span className={styles["shop-quickview__subtitle"]}>Our product</span>
                    <button
                        type="button"
                        className={styles["shop-quickview__close-btn"]}
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M36 36 24 24m0 0L12 12m12 12 12-12M24 24 12 36" stroke="#bc9e62" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* Nội dung sản phẩm */}
                <div className={styles["shop-quickview__body"]}>
                    {/* Ảnh sản phẩm */}
                    <div className={styles["shop-quickview__image-wrapper"]}>
                        <img
                            src={product.image}
                            alt={product.imageAlt}
                            className={styles["shop-quickview__image"]}
                        />
                    </div>

                    {/* Thông tin chi tiết */}
                    <div className={styles["shop-quickview__info"]}>
                        <h2 className={styles["shop-quickview__title"]}>
                            {product.name}
                        </h2>

                        <div className={styles["shop-quickview__price"]}>
                            {product.price}
                        </div>

                        <p className={styles["shop-quickview__description"]}>
                            {product.description || "Light Energy Masque works together with light therapy to amplify its effects. It helps support skin's energy, smooth skin texture, diminish the look of lines and wrinkles faster than light energy alone and soothes and calms inflammation or redness from light therapy."}
                        </p>

                        {/* Hàng số lượng & tồn kho */}
                        <div className={styles["shop-quickview__stock-row"]}>
                            <div className={styles["shop-quickview__stock-info"]}>
                                <span className={styles["shop-quickview__quantity-label"]}>Quantity</span>
                                <span className={styles["shop-quickview__stock-count"]}>
                                    In stock: {product.stock ?? 26} product
                                </span>
                            </div>

                            <div className={styles["shop-quickview__quantity-control"]}>
                                <button
                                    type="button"
                                    className={styles["shop-quickview__qty-btn"]}
                                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                >
                                    −
                                </button>
                                <span className={styles["shop-quickview__qty-value"]}>{quantity}</span>
                                <button
                                    type="button"
                                    className={styles["shop-quickview__qty-btn"]}
                                    onClick={() => setQuantity((prev) => prev + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Nút Add to Cart và Buy Now */}
                        <div className={styles["shop-quickview__actions"]}>
                            <button type="button" className={styles["shop-quickview__add-to-cart-btn"]}>
                                ADD TO CART
                            </button>
                            <button type="button" className={styles["shop-quickview__buy-now-btn"]}>
                                BUY NOW
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
