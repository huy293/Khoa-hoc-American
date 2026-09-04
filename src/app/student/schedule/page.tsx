import { Metadata } from "next";
import ScheduleContent from "./ScheduleContent";

export const metadata: Metadata = {
    title: "Lịch học | Couture Beauty Academy",
    description: "Lịch học của bạn tại Couture Beauty Academy",
};

export default function SchedulePage() {
    return <ScheduleContent />;
}