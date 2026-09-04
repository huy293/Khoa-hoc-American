import ScheduleDetailedSection, { ScheduleDetailGroup } from '@/components/dashboard/schedule/ScheduleDetailedSection';

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
                title: 'Class Schedule HydraFacial lesson 1 On-Site',
                titleVariant: 'gold',
                time: '13:00 - 16:20',
                format: 'On-site',
                location: 'Couture Beauty Academy · Training Room 02',
                studentsCount: 145,
                studentsLabel: 'Students participated',
            },
            {
                id: 'item-1-2',
                title: 'Class Schedule HydraFacial lesson 1 On-Site',
                titleVariant: 'gold',
                time: '13:00 - 16:20',
                format: 'On-site',
                location: 'Couture Beauty Academy · Training Room 02',
                studentsCount: 145,
                studentsLabel: 'Students participated',
            },
        ],
    },
    {
        id: 'group-2',
        date: {
            dayName: 'Tue',
            dayNum: 16,
            month: 'February',
        },
        badgeTheme: 'gray',
        items: [
            {
                id: 'item-2-1',
                title: 'Class Schedule HydraFacial lesson 1 On-Site',
                titleVariant: 'dark',
                time: '13:00 - 16:20',
                format: 'On-site',
                location: 'Couture Beauty Academy · Training Room 02',
                studentsCount: 145,
                studentsLabel: 'Students participated',
            },
        ],
    },
    {
        id: 'group-3',
        date: {
            dayName: 'Tue',
            dayNum: 16,
            month: 'February',
        },
        badgeTheme: 'gray',
        items: [
            {
                id: 'item-3-1',
                title: 'Class Schedule HydraFacial lesson 1 On-Site',
                titleVariant: 'dark',
                time: '13:00 - 16:20',
                format: 'On-site',
                location: 'Couture Beauty Academy · Training Room 02',
                studentsCount: 145,
                studentsLabel: 'Students participated',
            },
        ],
    },
    {
        id: 'group-4',
        date: {
            dayName: 'Tue',
            dayNum: 16,
            month: 'February',
        },
        badgeTheme: 'gray',
        items: [
            {
                id: 'item-4-1',
                title: 'Class Schedule HydraFacial lesson 1 On-Site',
                titleVariant: 'dark',
                time: '13:00 - 16:20',
                format: 'On-site',
                location: 'Couture Beauty Academy · Training Room 02',
                studentsCount: 145,
                studentsLabel: 'Students participated',
            },
        ],
    },
    {
        id: 'group-5',
        date: {
            dayName: 'Tue',
            dayNum: 16,
            month: 'February',
        },
        badgeTheme: 'gray',
        items: [
            {
                id: 'item-5-1',
                title: 'Class Schedule HydraFacial lesson 1 On-Site',
                titleVariant: 'dark',
                time: '13:00 - 16:20',
                format: 'On-site',
                location: 'Couture Beauty Academy · Training Room 02',
                studentsCount: 145,
                studentsLabel: 'Students participated',
            },
        ],
    },
];

export default function ScheduleContent() {
    return (
        <>
            <ScheduleDetailedSection
                scheduleGroups={SCHEDULE_GROUPS}
                columnEnd="students-participated"
            />
        </>
    );
}