import { Metadata } from "next";
import ScheduleContent from "./ScheduleContent";
import { getWpSchedule, getWpCourses } from "@/lib/wordpress-queries";
import { ScheduleDetailGroup } from "@/components/dashboard/schedule/ScheduleDetailedSection";

export const metadata: Metadata = {
    title: "Lịch học | Couture Beauty Academy",
    description: "Lịch học của bạn tại Couture Beauty Academy",
};

export default async function SchedulePage() {
    let scheduleGroups: ScheduleDetailGroup[] | undefined = undefined;

    const now = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const currentDayName = dayNames[now.getDay()];
    const currentDayNum = now.getDate();
    const currentMonth = monthNames[now.getMonth()];

    try {
        const [events, courses] = await Promise.all([
            getWpSchedule({ role: 'student' }),
            getWpCourses(4),
        ]);

        if (events && events.length > 0) {
            scheduleGroups = [
                {
                    id: 'group-wp-1',
                    date: {
                        dayName: currentDayName,
                        dayNum: currentDayNum,
                        month: currentMonth,
                    },
                    badgeTheme: 'cream',
                    items: events.map((ev, idx) => ({
                        id: ev.id || `ev-${idx}`,
                        title: ev.title || 'Buổi học chuyên đề',
                        titleVariant: idx % 2 === 0 ? 'gold' : 'dark',
                        time: ev.time || '09:00 - 10:20',
                        format: (ev.room ? 'On-site' : 'Online') as 'Online' | 'On-site',
                        location: ev.room || ev.zoomLink || 'Online / VOD',
                        trainer: {
                            name: ev.instructor || 'American Master Trainer',
                            rating: '5.0/5.0',
                            avatar: '/images/kathleen.png',
                        },
                    })),
                },
            ];
        } else if (courses && courses.length > 0) {
            scheduleGroups = [
                {
                    id: 'group-dynamic-1',
                    date: {
                        dayName: currentDayName,
                        dayNum: currentDayNum,
                        month: currentMonth,
                    },
                    badgeTheme: 'cream',
                    items: courses.slice(0, 2).map((c, idx) => ({
                        id: `item-${c.id || idx}`,
                        title: `${c.title} - Lớp trực tuyến`,
                        titleVariant: idx % 2 === 0 ? 'gold' : 'dark',
                        time: idx === 0 ? '09:00 - 10:30' : '14:00 - 16:00',
                        format: (idx === 0 ? 'Online' : 'On-site') as 'Online' | 'On-site',
                        location: idx === 0 ? 'Phòng học trực tuyến / Zoom LMS' : 'Couture Beauty Academy - Phòng thực hành 01',
                        trainer: {
                            name: (c.courseFields as any)?.trainer?.name || (c as any).author?.name || 'American Master Trainer',
                            rating: (c.courseFields as any)?.rating || (c.rating ? `${c.rating}/5.0` : '5.0/5.0'),
                            avatar: (c.courseFields as any)?.trainer?.avatar || (c as any).author?.avatar || '/images/kathleen.png',
                        },
                    })),
                },
            ];
        }
    } catch {
        // Fallback
    }

    return <ScheduleContent scheduleGroups={scheduleGroups} />;
}