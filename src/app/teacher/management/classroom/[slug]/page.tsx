import ClassroomDetailsIntro from '@/components/teacher/management/classroom/ClassroomDetailsIntro';
import LearningContent from '@/components/dashboard/courses/LearningContent';
import ResourcesContent from '@/app/teacher/resources/ResourcesContent';

export async function generateStaticParams() {
    return [{ slug: 'hydra-facial' }];
}

export default function ClassRoomDetailsPage() {
    return (
        <>
            <ClassroomDetailsIntro />
            <LearningContent columnEnd="progress" />
            <ResourcesContent ShowTab={false} styleSearch="style2" limit={4} />
        </>
    );
}
