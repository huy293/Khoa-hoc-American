"use client";

import { useState } from "react";
import Link from "next/link";
import BannerSection from "@/components/shop/BannerSection";
import ProductCard, { Product } from "@/components/shop/ProductCard";
import QuickViewProduct from "@/components/shop/QuickViewProduct";
import styles from "@/styles/shop/ProductDetail.module.css";

interface ProductDetailContentProps {
    slug: string;
}

type TabType = "describe" | "benefit" | "instructions" | "ingredient";

const PRODUCT_IMAGES = [
    "/images/anh-san-pham.png",
];

const SUGGESTED_PRODUCTS: Product[] = [
    {
        id: 1,
        slug: "light-energy-masque-professional",
        name: "(Dermalogica) Light Energy Masque Professional",
        image: "/images/anh-san-pham.png",
        imageAlt: "(Dermalogica) Light Energy Masque Professional",
        oldPrice: "$ 85.00",
        price: "$ 65.00",
    },
    {
        id: 2,
        slug: "barrier-repair-salon-size-118ml",
        name: "(Dermalogica) Barrier Repair/ Salon size: 4 oz (118ml) Professional",
        image: "/images/anh-san-pham.png",
        imageAlt: "(Dermalogica) Barrier Repair/ Salon size: 4 oz (118ml) Professional",
        oldPrice: "$ 185.00",
        price: "$ 165.00",
    },
    {
        id: 3,
        slug: "stabilizing-repair-cream-pro-177ml",
        name: "(Dermalogica) Stabilizing Repair Cream Pro / Size: 6 oz (177ml) Professional",
        image: "/images/anh-san-pham.png",
        imageAlt: "(Dermalogica) Stabilizing Repair Cream Pro / Size: 6 oz (177ml) Professional",
        oldPrice: "$ 285.00",
        price: "$ 225.00",
    },
    {
        id: 4,
        slug: "pro-restore-12-vials",
        name: "(Dermalogica) Pro Restore 12 × 0.1oz (3 ml tubes) vials Professional",
        image: "/images/anh-san-pham.png",
        imageAlt: "(Dermalogica) Pro Restore 12 × 0.1oz (3 ml tubes) vials Professional",
        oldPrice: "$ 85.00",
        price: "$ 65.00",
    },
    {
        id: 5,
        slug: "exo-booster-3-pack",
        name: "(Dermalogica) Exo Booster/ 3 pack Professional",
        image: "/images/anh-san-pham.png",
        imageAlt: "(Dermalogica) Exo Booster/ 3 pack Professional",
        oldPrice: "$ 585.00",
        price: "$ 465.00",
    },
];

export default function ProductDetailContent({ slug }: ProductDetailContentProps) {
    const [activeTab, setActiveTab] = useState<TabType>("describe");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? PRODUCT_IMAGES.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev === PRODUCT_IMAGES.length - 1 ? 0 : prev + 1));
    };

    return (
        <main className={styles["product-detail"]}>
            <BannerSection />

            {/* 1. Main Product Section */}
            <section className={styles["shop-products"]}>
                <div className={styles["shop-products__wrapper"]}>
                    <div className={styles["shop-products__container"]}>
                        {/* Header Title */}
                        <div className={styles["shop-products__header"]}>
                            <h2 className={styles["shop-products__title"]}>OUR PRODUCT</h2>
                        </div>

                        {/* Toolbar: Search & Filters */}
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
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" fill="none" className={styles["shop-products__filter-icon"]}>
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

                        {/* Main Detail Content (2 Columns: Gallery & Tabbed Information) */}
                        <div className={styles["product-detail-section__main"]}>
                            {/* Left Column: Image Carousel */}
                            <div className={styles["product-detail-section__gallery"]}>
                                <button
                                    type="button"
                                    className={`${styles["product-detail-section__nav-btn"]} ${styles["product-detail-section__nav-btn--prev"]}`}
                                    onClick={handlePrevImage}
                                    aria-label="Previous image"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A7043" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                </button>

                                <div className={styles["product-detail-section__image-box"]}>
                                    <img
                                        src={PRODUCT_IMAGES[currentImageIndex]}
                                        alt="Product detail"
                                        className={styles["product-detail-section__image"]}
                                    />
                                </div>

                                <button
                                    type="button"
                                    className={`${styles["product-detail-section__nav-btn"]} ${styles["product-detail-section__nav-btn--next"]}`}
                                    onClick={handleNextImage}
                                    aria-label="Next image"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A7043" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>
                            </div>

                            {/* Right Column: Tabbed Information */}
                            <div className={styles["product-detail-section__content"]}>
                                {/* Tabs Navigation */}
                                <div className={styles["product-detail-section__tabs"]}>
                                    <button
                                        type="button"
                                        className={`${styles["product-detail-section__tab-btn"]} ${activeTab === "describe" ? styles["product-detail-section__tab-btn--active"] : ""}`}
                                        onClick={() => setActiveTab("describe")}
                                    >
                                        DESCRIBE
                                    </button>
                                    <button
                                        type="button"
                                        className={`${styles["product-detail-section__tab-btn"]} ${activeTab === "benefit" ? styles["product-detail-section__tab-btn--active"] : ""}`}
                                        onClick={() => setActiveTab("benefit")}
                                    >
                                        BENEFIT
                                    </button>
                                    <button
                                        type="button"
                                        className={`${styles["product-detail-section__tab-btn"]} ${activeTab === "instructions" ? styles["product-detail-section__tab-btn--active"] : ""}`}
                                        onClick={() => setActiveTab("instructions")}
                                    >
                                        INSTRUCTIONS FOR USE
                                    </button>
                                    <button
                                        type="button"
                                        className={`${styles["product-detail-section__tab-btn"]} ${activeTab === "ingredient" ? styles["product-detail-section__tab-btn--active"] : ""}`}
                                        onClick={() => setActiveTab("ingredient")}
                                    >
                                        INGREDIENT
                                    </button>
                                </div>

                                {/* Tab Content Panel */}
                                <div className={styles["product-detail-section__tab-panel"]}>
                                    {activeTab === "describe" && (
                                        <div className={styles["product-detail-section__tab-pane"]}>
                                            <p className={styles["product-detail-section__text"]}>
                                                Primary Package: Reawakening, rich cream with potent peptides and phytoactives moisturizes for a redensified, lifted look and visibly reduces signs of skin aging.
                                            </p>
                                            <p className={styles["product-detail-section__text"]} style={{ marginTop: "16px" }}>
                                                Carton: Transformative eye cream with potent peptides and phytoactives delivers a more lifted look. See an immediate lift and reduced signs of skin aging overtime. Quinoa Seed Extract helps to visibly reduce eyelid folds and refine skin&apos;s texture. A duo of powerful peptides visibly firms, boosts skin&apos;s resilience, and defends against free radicals. Adaptogenic Astragalus, Electric Daisy Flower and CoQ10 smooth and tighten for a lifted look. A moisturizing blend with Cassava extract smooths to reduce the appearance of fine lines and wrinkles. Matcha Butter, Squalane, Vitamin E, and Pro-Vitamin B5 hydrate &amp; soothe.
                                            </p>
                                        </div>
                                    )}

                                    {activeTab === "benefit" && (
                                        <div className={styles["product-detail-section__tab-pane"]}>
                                            <ul className={styles["product-detail-section__list"]}>
                                                <li className={styles["product-detail-section__list-item"]}>
                                                    Enhances the effectiveness of red light therapy.
                                                </li>
                                                <li className={styles["product-detail-section__list-item"]}>
                                                    Supports skin energy by boosting ATP production.
                                                </li>
                                                <li className={styles["product-detail-section__list-item"]}>
                                                    Helps soothe and reduce inflammation or redness associated with light therapy.
                                                </li>
                                            </ul>
                                        </div>
                                    )}

                                    {activeTab === "instructions" && (
                                        <div className={styles["product-detail-section__tab-pane"]}>
                                            <div className={styles["product-detail-section__instructions-block"]}>
                                                <h4 className={styles["product-detail-section__subheading"]}>
                                                    Red light therapy with a light-energy mask
                                                </h4>
                                                <ul className={styles["product-detail-section__list"]}>
                                                    <li className={styles["product-detail-section__list-item"]}>
                                                        Scoop one teaspoon into a cup and apply a thick layer to the skin as needed using the dedicated spatula.
                                                    </li>
                                                    <li className={styles["product-detail-section__list-item"]}>
                                                        Proceed with red light therapy over the mask layer.
                                                    </li>
                                                    <li className={styles["product-detail-section__list-item"]}>
                                                        Wipe off any excess product using a specialized wet wipe, cotton towel, or cotton pad.
                                                    </li>
                                                    <li className={styles["product-detail-section__list-item"]}>
                                                        Complete the routine by layering your skincare products.
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className={styles["product-detail-section__instructions-block"]}>
                                                <h4 className={styles["product-detail-section__subheading"]}>
                                                    IPL Light-Activated Mask
                                                </h4>
                                                <ul className={styles["product-detail-section__list"]}>
                                                    <li className={styles["product-detail-section__list-item"]}>
                                                        Place one tablespoon of the product into a bowl and apply a thick layer to the skin using the dedicated spatula.
                                                    </li>
                                                    <li className={styles["product-detail-section__list-item"]}>
                                                        Perform the IPL treatment over the mask layer. Apply more product if necessary.
                                                    </li>
                                                    <li className={styles["product-detail-section__list-item"]}>
                                                        Remove any remaining mask from the skin using a soft, damp cloth, a cotton towel, or a cotton pad.
                                                    </li>
                                                    <li className={styles["product-detail-section__list-item"]}>
                                                        Complete the procedure by layering appropriate skincare products.
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "ingredient" && (
                                        <div className={styles["product-detail-section__ingredient-content"]}>
                                            <p className={styles["product-detail-section__text"]}>
                                                Water/Aqua/Eau, Butylene Glycol, Glycerin, Propanediol, Carbomer, Palmitoyl Tripeptide-38,
                                                Hydroxyacetophenone, Laminaria Digitata Extract, Lindera Strychnifolia Root Extract, Hibiscus
                                                Sabdariffa Fruit Extract, Leuconostoc/Radish Root Ferment Filtrate, Olea Europaea (Olive) Leaf Extract,
                                                Cyamopsis Tetragonoloba (Guar) Gum, Tocopherol, Magnesium Aspartate, Biosaccharide Gum-1,
                                                Disodium Adenosine Triphosphate, Sodium Levulinate, Glyceryl Caprylate, Saccharide Isomerate,
                                                Pentylene Glycol, Hydroxypropyl Cyclodextrin, Aspergillus Ferment, Xanthan Gum, Erythritol,
                                                Tetrasodium Glutamate Diacetate, Aminomethyl Propanol, Citric Acid, Sodium Hydroxide, Acid p-Anisic,
                                                Sodium Citrate, Dehydroacetic Acid.
                                            </p>

                                            <ul className={styles["product-detail-section__list"]}>
                                                <li className={styles["product-detail-section__list-item"]}>
                                                    <strong>Lindera root extract:</strong> Rich in Lindera oligo-alpha-glucan and antioxidants; enhances skin radiance, smoothness, and elasticity when combined with LED therapy.
                                                </li>
                                                <li className={styles["product-detail-section__list-item"]}>
                                                    <strong>Olive leaf extract:</strong> Rich in phospholipids; helps reduce the appearance of wrinkles and crow&apos;s feet while improving skin smoothness and firmness.
                                                </li>
                                                <li className={styles["product-detail-section__list-item"]}>
                                                    <strong>A blend of brown algae extract, magnesium aspartate, and ATP:</strong> Improves skin texture and smoothness; offers antioxidant properties to help repair visible damage.
                                                </li>
                                                <li className={styles["product-detail-section__list-item"]}>
                                                    <strong>Hibiscus fruit extract:</strong> Provides immediate and long-lasting hydration.
                                                </li>
                                                <li className={styles["product-detail-section__list-item"]}>
                                                    <strong>Biosaccharide Gum-1:</strong> Soothes and calms the skin.
                                                </li>
                                                <li className={styles["product-detail-section__list-item"]}>
                                                    <strong>Palmitoyl LDL peptide:</strong> Helps reduce the appearance of wrinkles and fine lines.
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Suggested Products Section */}
            <section className={styles["suggested-products"]}>
                <div className={styles["suggested-products__wrapper"]}>
                    <div className={styles["suggested-products__header"]}>
                        <h2 className={styles["suggested-products__title"]}>SUGGESTED PRODUCTS</h2>
                        <Link href="/shop" className={styles["suggested-products__see-more"]}>
                            See more
                        </Link>
                    </div>

                    <div className={styles["suggested-products__grid"]}>
                        {SUGGESTED_PRODUCTS.map((item) => (
                            <ProductCard
                                key={item.id}
                                product={item}
                                onQuickView={(prod) => setSelectedProduct(prod)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Quick View Modal */}
            <QuickViewProduct
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </main>
    );
}
