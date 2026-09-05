import MyScheduleSection from '@/components/dashboard/schedule/MyScheduleSection';
import ScheduleDetailedSection, { ScheduleDetailGroup } from '@/components/dashboard/schedule/ScheduleDetailedSection';

export interface ScheduleContentProps {
    scheduleGroups?: ScheduleDetailGroup[];
}

export default function ScheduleContent({ scheduleGroups }: ScheduleContentProps = {}) {
    return (
        <>
            <MyScheduleSection />
            <ScheduleDetailedSection scheduleGroups={scheduleGroups} />
        </>
    );
}