import { Metadata } from "next";
import ScheduleContent from "./ScheduleContent";
import { getWpSchedule, getWpCourses } from "@/lib/wordpress-queries";
import { ScheduleDetailGroup } from "@/components/dashboard/schedule/ScheduleDetailedSection";

export const metadata: Metadata = {
    title: "Lịch dạy | Couture Beauty Academy",
    description: "Lịch giảng dạy của giảng viên tại Couture Beauty Academy",
};

export default async function TeacherSchedulePage() {
    let scheduleGroups: ScheduleDetailGroup[] | undefined = undefined;
    try {
        const [events, courses] = await Promise.all([
            getWpSchedule({ role: 'teacher' }),
            getWpCourses(10),
        ]);

        const today = new Date();
        const currentDayName = today.toLocaleDateString('en-US', { weekday: 'short' });
        const currentMonthName = today.toLocaleDateString('en-US', { month: 'long' });

        if (events && events.length > 0) {
            scheduleGroups = [
                {
                    id: 'group-teacher-1',
                    date: {
                        dayName: currentDayName,
                        dayNum: today.getDate(),
                        month: currentMonthName,
                    },
                    badgeTheme: 'cream',
                    items: events.map((ev, idx) => ({
                        id: ev.id || `ev-t-${idx}`,
                        title: ev.title || 'Class Schedule Training',
                        titleVariant: idx % 2 === 0 ? 'gold' : 'dark',
                        time: ev.time || '13:00 - 16:20',
                        format: (ev.room ? 'On-site' : 'Online') as 'Online' | 'On-site',
                        location: ev.room || 'Couture Beauty Academy · Training Room 02',
                        studentsCount: Number((ev as any).studentsCount || 0),
                        studentsLabel: 'Students participated',
                    })),
                },
            ];
        } else if (courses && courses.length > 0) {
            scheduleGroups = [
                {
                    id: 'group-teacher-auto',
                    date: {
                        dayName: currentDayName,
                        dayNum: today.getDate(),
                        month: currentMonthName,
                    },
                    badgeTheme: 'cream',
                    items: courses.slice(0, 4).map((c, idx) => ({
                        id: `ev-c-${c.id || idx}`,
                        title: `${c.title} - Buổi thực hành chuyên sâu`,
                        titleVariant: idx % 2 === 0 ? 'gold' : 'dark',
                        time: idx % 2 === 0 ? '09:00 - 11:30' : '13:30 - 16:30',
                        format: (idx % 2 === 0 ? 'Online' : 'On-site') as 'Online' | 'On-site',
                        location: idx % 2 === 0 ? 'Online / Live Webinar' : 'Couture Beauty Academy · Phòng Thực Hành 02',
                        studentsCount: Number((c as any).studentsCount || c.courseFields?.enrolledCount || 0),
                        studentsLabel: 'Students participated',
                    })),
                },
            ];
        }
    } catch {
        // Fallback
    }

    return <ScheduleContent scheduleGroups={scheduleGroups} />;
}