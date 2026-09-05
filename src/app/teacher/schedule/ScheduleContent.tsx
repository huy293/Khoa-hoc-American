import ScheduleDetailedSection, { ScheduleDetailGroup } from '@/components/dashboard/schedule/ScheduleDetailedSection';

export interface ScheduleContentProps {
    scheduleGroups?: ScheduleDetailGroup[];
}

export default function ScheduleContent({ scheduleGroups }: ScheduleContentProps = {}) {
    const list = scheduleGroups && scheduleGroups.length > 0 ? scheduleGroups : [];

    return (
        <>
            <ScheduleDetailedSection
                scheduleGroups={list}
                columnEnd="students-participated"
            />
        </>
    );
}