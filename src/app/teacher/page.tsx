import { Metadata } from 'next';
import ScheduleDetailedSection, { ScheduleDetailGroup } from '@/components/dashboard/schedule/ScheduleDetailedSection';
import MyCourses from '@/components/dashboard/home/MyCourses';
import OverviewMetrics from '@/components/teacher/home/OverviewMetrics';
import { getWpCourses, getWpTeacherStudents, getWpSchedule } from '@/lib/wordpress-queries';

export const metadata: Metadata = {
    title: 'Teacher Dashboard | Couture Beauty Academy',
    description: 'Teacher course and class management dashboard',
};

export default async function TeacherHomepage() {
    let courses: any[] = [];
    let students: any[] = [];
    let scheduleEvents: any[] = [];

    try {
        const [wpCourses, wpStudents, wpSchedule] = await Promise.all([
            getWpCourses(30),
            getWpTeacherStudents(),
            getWpSchedule({ role: 'teacher' }),
        ]);
        courses = wpCourses || [];
        students = wpStudents || [];
        scheduleEvents = wpSchedule || [];
    } catch {
        // Fallback gracefully
    }

    const onlineCourses = courses.filter((c, idx) => idx % 2 === 0);
    const onsiteCourses = courses.filter((c, idx) => idx % 2 !== 0);

    const stats = {
        totalOnlineClass: onlineCourses.length,
        totalOnsiteClass: onsiteCourses.length,
        totalStudents: students.length > 0 ? students.length : courses.reduce((sum, c) => sum + (c.courseFields?.enrolledCount || 0), 0),
        totalGraduated: students.filter((s) => s.status === 'completed' || s.score >= 80).length,
    };

    // Tạo lịch dạy động từ ngày hiện tại
    const today = new Date();
    const currentDayName = today.toLocaleDateString('en-US', { weekday: 'short' });
    const currentMonthName = today.toLocaleDateString('en-US', { month: 'long' });

    let scheduleGroups: ScheduleDetailGroup[] = [];
    if (courses.length > 0) {
        const firstTwoCourses = courses.slice(0, 2);
        scheduleGroups.push({
            id: 'today-schedule',
            date: {
                dayName: currentDayName,
                dayNum: today.getDate(),
                month: currentMonthName,
            },
            badgeTheme: 'cream',
            items: firstTwoCourses.map((c, i) => {
                const cf = c.courseFields || {};
                const isOnline = i === 0;
                return {
                    id: `schedule-item-${c.id || i}`,
                    title: `${c.title} - ${isOnline ? 'Online Class' : 'Practical Training'}`,
                    titleVariant: 'gold' as const,
                    time: isOnline ? '09:00 - 11:30' : '13:30 - 16:30',
                    format: isOnline ? ('Online' as const) : ('On-site' as const),
                    location: isOnline ? 'Online / Live Webinar' : 'Couture Beauty Academy - Training Room 02',
                    trainer: cf.trainer?.name ? {
                        name: cf.trainer.name,
                        rating: cf.trainer.rating || '',
                        avatar: cf.trainer.avatar || '/images/kathleen.png',
                    } : undefined,
                };
            }),
        });
    }

    return (
        <>
            <OverviewMetrics stats={stats} />
            {scheduleGroups.length > 0 && (
                <ScheduleDetailedSection
                    title="Today's class"
                    scheduleGroups={scheduleGroups}
                    seeMore={true}
                />
            )}
            <MyCourses
                tag="COURSES MANAGEMENT"
                title="Online Courses"
                cardVariant="teacher"
                courses={onlineCourses}
            />
            <MyCourses
                tag="COURSES MANAGEMENT"
                title="On-site Courses"
                cardVariant="teacher"
                courses={onsiteCourses}
            />
        </>
    );
}