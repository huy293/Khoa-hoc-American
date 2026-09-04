import CourseDetailsIntro from "@/components/dashboard/courses/CourseDetailsIntro";
import LearningContent from "@/components/dashboard/courses/LearningContent";
import { WPCourse } from "@/types/wordpress";

interface CourseDetailsContentProps {
    course?: WPCourse | null;
    slug?: string;
}

export default function CourseDetailsContent({ course, slug }: CourseDetailsContentProps) {
    return (
        <>
            <CourseDetailsIntro course={course} />
            <LearningContent course={course} />
        </>
    );
}

