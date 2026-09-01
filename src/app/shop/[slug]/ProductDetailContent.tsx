"use client";

import { useState } from "react";
import Link from "next/link";
import BannerSection from "@/components/shop/BannerSection";
import ProductCard, { Product } from "@/components/shop/ProductCard";
import QuickViewProduct from "@/components/shop/QuickViewProduct";
import styles from "@/styles/shop/ProductDetail.module.css";

import { WPProduct } from "@/types/wordpress";

interface ProductDetailContentProps {
    slug: string;
    initialProduct?: WPProduct;
    suggestedProducts?: WPProduct[];
}

type TabType = "describe" | "benefit" | "instructions" | "ingredient";

const DEFAULT_PRODUCT_IMAGES = [
    "/images/anh-san-pham.png",
];

const StockBasketIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.24 5.58H18.84L15.46 2.2C15.19 1.93 14.75 1.93 14.47 2.2C14.2 2.47 14.2 2.91 14.47 3.19L16.86 5.58H7.14L9.53 3.19C9.8 2.92 9.8 2.48 9.53 2.2C9.26 1.93 8.82 1.93 8.54 2.2L5.17 5.58H4.77C3.87 5.58 2 5.58 2 8.14C2 9.11 2.2 9.75 2.62 10.17C2.86 10.42 3.15 10.55 3.46 10.62C3.75 10.69 4.06 10.7 4.36 10.7H19.64C19.95 10.7 20.24 10.68 20.52 10.62C21.36 10.42 22 9.82 22 8.14C22 5.58 20.13 5.58 19.24 5.58Z" fill="#FF9C00" />
        <path d="M19.0897 12H4.90971C4.28971 12 3.81971 12.55 3.91971 13.16L4.75971 18.3C5.03971 20.02 5.78971 22 9.11971 22H14.7297C18.0997 22 18.6997 20.31 19.0597 18.42L20.0697 13.19C20.1897 12.57 19.7197 12 19.0897 12ZM14.8797 16.05L11.6297 19.05C11.4897 19.18 11.3097 19.25 11.1197 19.25C10.9297 19.25 10.7397 19.18 10.5897 19.03L9.08971 17.53C8.79971 17.24 8.79971 16.76 9.08971 16.47C9.38971 16.18 9.85971 16.18 10.1597 16.47L11.1497 17.46L13.8697 14.95C14.1697 14.67 14.6497 14.69 14.9297 14.99C15.2097 15.3 15.1897 15.77 14.8797 16.05Z" fill="#FF9C00" />
    </svg>
);

export default function ProductDetailContent({ slug, initialProduct, suggestedProducts }: ProductDetailContentProps) {
    const [activeTab, setActiveTab] = useState<TabType>("describe");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Images from gallery or fallback
    const images: string[] = (initialProduct?.galleryImages?.nodes && initialProduct.galleryImages.nodes.length > 0)
        ? initialProduct.galleryImages.nodes.map(n => n.sourceUrl || DEFAULT_PRODUCT_IMAGES[0]).filter(Boolean) as string[]
        : initialProduct?.image?.sourceUrl
            ? [initialProduct.image.sourceUrl]
            : DEFAULT_PRODUCT_IMAGES;

    const currentProduct: Product = initialProduct ? {
        id: initialProduct.databaseId || Number(initialProduct.id) || 1,
        slug: initialProduct.slug || slug,
        name: initialProduct.name,
        image: images[0] || DEFAULT_PRODUCT_IMAGES[0],
        imageAlt: initialProduct.name,
        price: initialProduct.price || initialProduct.salePrice || "$ 65.00",
        oldPrice: initialProduct.regularPrice || "",
        stock: initialProduct.stock || 26,
        description: initialProduct.description ? initialProduct.description.replace(/<[^>]*>/g, '').trim() : "Light Energy Masque works together with light therapy to amplify its effects.",
    } : {
        id: 1,
        slug: slug,
        name: "(Dermalogica) Light Energy Masque Professional",
        image: DEFAULT_PRODUCT_IMAGES[0],
        imageAlt: "(Dermalogica) Light Energy Masque Professional",
        price: "$ 65.00",
        oldPrice: "$ 85.00",
        stock: 26,
        description: "Light Energy Masque works together with light therapy to amplify its effects. It helps support skin's energy, smooth skin texture, diminish the look of lines and wrinkles faster than light energy alone and soothes and calms inflammation or redness from light therapy.",
    };

    const suggestedList: Product[] = (suggestedProducts && suggestedProducts.length > 0)
        ? suggestedProducts.filter(p => p.slug !== slug).slice(0, 5).map((p, index) => ({
            id: p.databaseId || Number(p.id) || index + 1,
            slug: p.slug,
            name: p.name,
            image: p.image?.sourceUrl || DEFAULT_PRODUCT_IMAGES[0],
            imageAlt: p.name,
            oldPrice: p.regularPrice || "",
            price: p.price || p.salePrice || "$ 0.00",
            description: p.description ? p.description.replace(/<[^>]*>/g, '').trim() : '',
            stock: p.stock || 26,
        }))
        : [];

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <main className={styles["product-detail"]}>
            <BannerSection />

            {/* 1. Main Product Section */}
            <section className={styles["shop-products"]}>
                <div className={styles["shop-products__wrapper"]}>
                    <div className={styles["shop-products__container"]}>
                        {/* Top Header Row (Title & In Stock Badge) */}
                        <div className={styles["shop-products__top-row"]}>
                            <div className={styles["shop-products__header"]}>
                                <h2 className={styles["shop-products__title"]}>{currentProduct.name}</h2>
                            </div>

                            {/* In Stock Badge Button */}
                            <button
                                type="button"
                                className={styles["product-detail__stock-badge"]}
                                onClick={() => setSelectedProduct(currentProduct)}
                                aria-label="View In Stock product details"
                            >
                                <div className={styles["product-detail__stock-icon-wrap"]}>
                                    <StockBasketIcon />
                                </div>
                                <div className={styles["product-detail__stock-text-wrap"]}>
                                    <span className={styles["product-detail__stock-label"]}>In stock:</span>
                                    <span className={styles["product-detail__stock-value"]}>26 product</span>
                                </div>
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
                                        src={images[currentImageIndex] || DEFAULT_PRODUCT_IMAGES[0]}
                                        alt={currentProduct.name}
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
                                            {initialProduct?.description ? (
                                                <div
                                                    className={styles["product-detail-section__text"]}
                                                    dangerouslySetInnerHTML={{ __html: initialProduct.description }}
                                                />
                                            ) : (
                                                <>
                                                    <p className={styles["product-detail-section__text"]}>
                                                        Primary Package: Reawakening, rich cream with potent peptides and phytoactives moisturizes for a redensified, lifted look and visibly reduces signs of skin aging.
                                                    </p>
                                                    <p className={styles["product-detail-section__text"]} style={{ marginTop: "16px" }}>
                                                        Carton: Transformative eye cream with potent peptides and phytoactives delivers a more lifted look. See an immediate lift and reduced signs of skin aging overtime. Quinoa Seed Extract helps to visibly reduce eyelid folds and refine skin&apos;s texture. A duo of powerful peptides visibly firms, boosts skin&apos;s resilience, and defends against free radicals. Adaptogenic Astragalus, Electric Daisy Flower and CoQ10 smooth and tighten for a lifted look. A moisturizing blend with Cassava extract smooths to reduce the appearance of fine lines and wrinkles. Matcha Butter, Squalane, Vitamin E, and Pro-Vitamin B5 hydrate &amp; soothe.
                                                    </p>
                                                </>
                                            )}
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
                        {(suggestedList.length > 0 ? suggestedList : []).map((item) => (
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
