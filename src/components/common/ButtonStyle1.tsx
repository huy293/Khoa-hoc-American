import React from "react";
import styles from "@/styles/common/ButtonStyle1.module.css";

interface ButtonStyle1Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    text?: string;
    children?: React.ReactNode;
}

export default function ButtonStyle1({
    text = "Explore more",
    children,
    className = "",
    href = "#explore",
    ...props
}: ButtonStyle1Props) {
    return (
        <a
            href={href}
            className={`${styles["button-style-1"]} ${className}`.trim()}
            {...props}
        >
            <span>{children || text}</span>
            <svg
                viewBox="0 0 18 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles["button-style-1__icon"]}
            >
                <path
                    d="M1 6H16.5M16.5 6L11.5 1M16.5 6L11.5 1M16.5 6L11.5 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </a>
    );
}
