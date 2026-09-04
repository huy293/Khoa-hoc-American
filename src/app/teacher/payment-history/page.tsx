import { Metadata } from "next";
import PaymentHistoryContent from "./PaymentHistoryContent";


export const metadata: Metadata = {
    title: "Payment History | Couture Beauty Academy",
    description: "Payment History | Couture Beauty Academy",
};

export default function PaymentHistoryPage() {
    return <PaymentHistoryContent />;
}