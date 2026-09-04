"use client";

import { useState } from "react";
import Image from "next/image";
import PaymentModal from "@/components/dashboard/cart/PaymentModal";
import styles from "@/styles/dashboard/cart/CartPageContent.module.css";

interface CartItem {
    id: string;
    title: string;
    image: string;
    price: number;
    code: string;
    size: string;
    quantity: number;
    stock: number;
}

const initialItems: CartItem[] = [
    {
        id: "1",
        title: "(Dermalogica) Light Energy Masque Professional",
        image: "/images/anh-san-pham.png",
        price: 65.0,
        code: "1736282937193",
        size: "170ml (4oz)",
        quantity: 1,
        stock: 26,
    },
    {
        id: "2",
        title: "(Dermalogica) Light Energy Masque Professional",
        image: "/images/anh-san-pham.png",
        price: 125.0,
        code: "1736282937193",
        size: "170ml (4oz)",
        quantity: 2,
        stock: 2,
    },
    {
        id: "3",
        title: "(Dermalogica) Light Energy Masque Professional",
        image: "/images/anh-san-pham.png",
        price: 125.0,
        code: "1736282937193",
        size: "170ml (4oz)",
        quantity: 1,
        stock: 26,
    },
];

export default function CartPageContent() {
    const [items, setItems] = useState<CartItem[]>(initialItems);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const updateQuantity = (id: string, delta: number) => {
        setItems((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            })
        );
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const totalProductCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingFee = items.length > 0 ? 45.0 : 0;
    const total = subtotal + shippingFee;

    return (
        <section className={styles["cart-page"]}>
            <div className={styles["cart-page__wrapper"]}>
                <div className={styles["cart-page__container"]}>
                    {/* Header */}
                    <div className={styles["cart-page__header"]}>
                        <h1 className={styles["cart-page__title"]}>shopping cart</h1>
                        <p className={styles["cart-page__total-count"]}>
                            Total product: {items.length}
                        </p>
                    </div>

                    {/* Content Body */}
                    <div className={styles["cart-page__body"]}>
                        {/* Cart list */}
                        <div className={styles["cart-page__list"]}>
                            {items.map((item) => (
                                <article key={item.id} className={styles["cart-item"]}>
                                    <div className={styles["cart-item__image-wrapper"]}>
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            width={150}
                                            height={150}
                                            className={styles["cart-item__image"]}
                                        />
                                    </div>
                                    <div className={styles["cart-item__info"]}>
                                        <h3 className={styles["cart-item__title"]}>{item.title}</h3>
                                        <div className={styles["cart-item__price-row"]}>
                                            <span className={styles["cart-item__price"]}>
                                                $ {item.price.toFixed(2)}
                                            </span>
                                            <span className={styles["cart-item__offer"]}>
                                                <svg
                                                    className={styles["cart-item__offer-icon"]}
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M21.1744 9.63937C20.8209 9.27 20.4553 8.88937 20.3175 8.55469C20.19 8.24813 20.1825 7.74 20.175 7.24781C20.1609 6.33281 20.1459 5.29594 19.425 4.575C18.7041 3.85406 17.6672 3.83906 16.7522 3.825C16.26 3.8175 15.7519 3.81 15.4453 3.6825C15.1116 3.54469 14.73 3.17906 14.3606 2.82562C13.7137 2.20406 12.9787 1.5 12 1.5C11.0213 1.5 10.2872 2.20406 9.63937 2.82562C9.27 3.17906 8.88937 3.54469 8.55469 3.6825C8.25 3.81 7.74 3.8175 7.24781 3.825C6.33281 3.83906 5.29594 3.85406 4.575 4.575C3.85406 5.29594 3.84375 6.33281 3.825 7.24781C3.8175 7.74 3.81 8.24813 3.6825 8.55469C3.54469 8.88844 3.17906 9.27 2.82562 9.63937C2.20406 10.2862 1.5 11.0213 1.5 12C1.5 12.9787 2.20406 13.7128 2.82562 14.3606C3.17906 14.73 3.54469 15.1106 3.6825 15.4453C3.81 15.7519 3.8175 16.26 3.825 16.7522C3.83906 17.6672 3.85406 18.7041 4.575 19.425C5.29594 20.1459 6.33281 20.1609 7.24781 20.175C7.74 20.1825 8.24813 20.19 8.55469 20.3175C8.88844 20.4553 9.27 20.8209 9.63937 21.1744C10.2862 21.7959 11.0213 22.5 12 22.5C12.9787 22.5 13.7128 21.7959 14.3606 21.1744C14.73 20.8209 15.1106 20.4553 15.4453 20.3175C15.7519 20.19 16.26 20.1825 16.7522 20.175C17.6672 20.1609 18.7041 20.1459 19.425 19.425C20.1459 18.7041 20.1609 17.6672 20.175 16.7522C20.1825 16.26 20.19 15.7519 20.3175 15.4453C20.4553 15.1116 20.8209 14.73 21.1744 14.3606C21.7959 13.7137 22.5 12.9787 22.5 12C22.5 11.0213 21.7959 10.2872 21.1744 9.63937ZM16.2806 10.2806L11.0306 15.5306C10.961 15.6004 10.8783 15.6557 10.7872 15.6934C10.6962 15.7312 10.5986 15.7506 10.5 15.7506C10.4014 15.7506 10.3038 15.7312 10.2128 15.6934C10.1217 15.6557 10.039 15.6004 9.96937 15.5306L7.71937 13.2806C7.57864 13.1399 7.49958 12.949 7.49958 12.75C7.49958 12.551 7.57864 12.3601 7.71937 12.2194C7.86011 12.0786 8.05098 11.9996 8.25 11.9996C8.44902 11.9996 8.63989 12.0786 8.78063 12.2194L10.5 13.9397L15.2194 9.21937C15.2891 9.14969 15.3718 9.09442 15.4628 9.0567C15.5539 9.01899 15.6515 8.99958 15.75 8.99958C15.8485 8.99958 15.9461 9.01899 16.0372 9.0567C16.1282 9.09442 16.2109 9.14969 16.2806 9.21937C16.3503 9.28906 16.4056 9.37178 16.4433 9.46283C16.481 9.55387 16.5004 9.65145 16.5004 9.75C16.5004 9.84855 16.481 9.94613 16.4433 10.0372C16.4056 10.1282 16.3503 10.2109 16.2806 10.2806Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                                <span>Offers Students</span>
                                            </span>
                                        </div>

                                        <ul className={styles["cart-item__metas"]}>
                                            <li className={styles["cart-item__meta"]}>
                                                <span className={styles["cart-item__meta-label"]}>
                                                    Product code:
                                                </span>
                                                <span className={styles["cart-item__meta-value"]}>
                                                    {item.code}
                                                </span>
                                            </li>
                                            <li className={styles["cart-item__meta"]}>
                                                <span className={styles["cart-item__meta-label"]}>
                                                    Size:
                                                </span>
                                                <span className={styles["cart-item__meta-value"]}>
                                                    {item.size}
                                                </span>
                                            </li>
                                            <li className={styles["cart-item__meta"]}>
                                                <span className={styles["cart-item__meta-label"]}>
                                                    Quantity:
                                                </span>
                                                <span className={styles["cart-item__meta-value"]}>
                                                    {item.quantity}
                                                </span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className={styles["cart-item__bottom-row"]}>
                                        <div className={styles["cart-item__stock-info"]}>
                                            <span className={styles["cart-item__stock-label"]}>
                                                Quantity
                                            </span>
                                            <span
                                                className={`${styles["cart-item__stock-status"]} ${item.stock <= 5
                                                        ? styles["cart-item__stock-status--low"]
                                                        : ""
                                                    }`}
                                            >
                                                In stock: {item.stock} product
                                            </span>
                                        </div>

                                        <div className={styles["cart-item__actions"]}>
                                            {/* Quantity Control */}
                                            <div className={styles["cart-item__qty-control"]}>
                                                <button
                                                    type="button"
                                                    className={styles["cart-item__qty-btn"]}
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    aria-label="Decrease quantity"
                                                >
                                                    <svg
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M5 12H19"
                                                            stroke="currentColor"
                                                            strokeWidth="2.5"
                                                            strokeLinecap="round"
                                                        />
                                                    </svg>
                                                </button>
                                                <span className={styles["cart-item__qty-value"]}>
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    className={styles["cart-item__qty-btn"]}
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    aria-label="Increase quantity"
                                                >
                                                    <svg
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M12 5V19M5 12H19"
                                                            stroke="currentColor"
                                                            strokeWidth="2.5"
                                                            strokeLinecap="round"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Delete Action */}
                                            <button
                                                className={styles["cart-item__delete-btn"]}
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                aria-label="Delete item"
                                            >
                                                <svg
                                                    width="22"
                                                    height="22"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M10 11V17M14 11V17M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M3 6H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
                                                        stroke="#CC0000"
                                                        strokeWidth="1.6"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Total Cost / Summary */}
                        <div className={styles["cart-page__summary"]}>
                            <div className={styles["cart-summary"]}>
                                <div className={styles["cart-summary__container"]}>
                                    <div className={styles["cart-summary__header"]}>
                                        <h2 className={styles["cart-summary__title"]}>
                                            TOTAL COST:
                                        </h2>
                                        <p className={styles["cart-summary__count"]}>
                                            {totalProductCount} products
                                        </p>
                                    </div>
                                    <div className={styles["cart-summary__table-wrapper"]}>
                                        <table className={styles["cart-summary__table"]}>
                                            <thead className={styles["cart-summary__table-head"]}>
                                                <tr className={styles["cart-summary__table-tr"]}>
                                                    <th className={styles["cart-summary__table-th"]}>
                                                        Name products
                                                    </th>
                                                    <th
                                                        className={`${styles["cart-summary__table-th"]} ${styles["cart-summary__table-th--center"]}`}
                                                    >
                                                        Quantity
                                                    </th>
                                                    <th
                                                        className={`${styles["cart-summary__table-th"]} ${styles["cart-summary__table-th--right"]}`}
                                                    >
                                                        Cost
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className={styles["cart-summary__table-body"]}>
                                                {items.map((item) => (
                                                    <tr
                                                        key={item.id}
                                                        className={styles["cart-summary__table-tr"]}
                                                    >
                                                        <td className={styles["cart-summary__table-td"]}>
                                                            <span
                                                                className={
                                                                    styles[
                                                                    "cart-summary__product-name"
                                                                    ]
                                                                }
                                                            >
                                                                {item.title}
                                                            </span>
                                                        </td>
                                                        <td
                                                            className={`${styles["cart-summary__table-td"]} ${styles["cart-summary__table-td--center"]}`}
                                                        >
                                                            {String(item.quantity).padStart(2, "0")}
                                                        </td>
                                                        <td
                                                            className={`${styles["cart-summary__table-td"]} ${styles["cart-summary__table-td--right"]}`}
                                                        >
                                                            $ {(item.price * item.quantity).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <ul className={styles["cart-summary__total-list"]}>
                                        <li className={styles["cart-summary__total-item"]}>
                                            <span className={styles["cart-summary__total-label"]}>
                                                Total order cost:
                                            </span>
                                            <span className={styles["cart-summary__total-value"]}>
                                                $ {subtotal.toFixed(2)}
                                            </span>
                                        </li>
                                        <li className={styles["cart-summary__total-item"]}>
                                            <span className={styles["cart-summary__total-label"]}>
                                                Estimated shipping fee:
                                            </span>
                                            <span className={styles["cart-summary__total-value"]}>
                                                $ {shippingFee.toFixed(2)}
                                            </span>
                                        </li>
                                        <li
                                            className={`${styles["cart-summary__total-item"]} ${styles["cart-summary__total-item--final"]}`}
                                        >
                                            <span className={styles["cart-summary__total-label"]}>
                                                Total :
                                            </span>
                                            <span className={styles["cart-summary__total-value"]}>
                                                $ {total.toFixed(2)}
                                            </span>
                                        </li>
                                    </ul>
                                    {/* Button Pay Now */}
                                    <button
                                        type="button"
                                        className={styles["cart-summary__pay-btn"]}
                                        onClick={() => setIsPaymentModalOpen(true)}
                                    >
                                        Pay Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment / Checkout Modal */}
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                subtotal={subtotal}
                shippingFee={shippingFee}
                memberDiscount={95.0}
                total={Math.max(0, subtotal + shippingFee - 95.0)}
            />
        </section>
    );
}
