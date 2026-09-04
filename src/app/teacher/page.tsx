'use client';

import ScheduleDetailedSection, { ScheduleDetailGroup } from '@/components/dashboard/schedule/ScheduleDetailedSection';
import MyCourses from '@/components/dashboard/home/MyCourses';
import OverviewMetrics from '@/components/teacher/home/OverviewMetrics';
import styles from '@/styles/teacher/TeacherHomepage.module.css';

const SCHEDULE_GROUPS: ScheduleDetailGroup[] = [
    {
        id: 'group-1',
        date: {
            dayName: 'Tue',
            dayNum: 16,
            month: 'February',
        },
        badgeTheme: 'cream',
        items: [
            {
                id: 'item-1-1',
                title: 'HydraFacial lesson 1 Online',
                titleVariant: 'gold',
                time: '09:00 - 10:20',
                format: 'Online',
                location: 'Online/ VOD',
                trainer: {
                    name: 'Kathleen trainer',
                    rating: '4.9/5.0',
                    avatar: '/images/kathleen.png',
                },
            },
            {
                id: 'item-1-2',
                title: 'Class Schedule HydraFacial lesson 1 Online',
                titleVariant: 'gold',
                time: '13:00 - 16:20',
                format: 'On-site',
                location: 'Couture Beauty Academy - Training Room 02',
                trainer: {
                    name: 'Kathleen trainer',
                    rating: '4.9/5.0',
                    avatar: '/images/kathleen.png',
                },
            },
        ],
    },
];

export default function TeacherHomepage() {
    return (
        <>
            <OverviewMetrics />
            <ScheduleDetailedSection title="Today's class" scheduleGroups={SCHEDULE_GROUPS} seeMore={true} />
            <MyCourses tag="COURSES MANAGEMENT" title="Online Courses" cardVariant="teacher" />
            <MyCourses tag="COURSES MANAGEMENT" title="On-site Courses" cardVariant="teacher" />
        </>
    );
}