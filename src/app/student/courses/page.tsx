import MyCourses from "@/components/dashboard/home/MyCourses";
import LearningResources from "@/components/dashboard/home/LearningResources";
import { getWpCourses } from "@/lib/wordpress-queries";

export const revalidate = 3600;

export default async function StudentCoursesPage() {
    const courses = await getWpCourses(50);

    return (
        <>
            <MyCourses
                tag="MY COURSES LIST"
                title="Let's explore the course together!"
                search={true}
                seemore={false}
                limit={8}
                loadmore={true}
                courses={courses}
            />
            <LearningResources
                tag='RESOURCES'
                title='Related Documents'
                filterTab={false}
                seemore={false}
                limit={4}
            />
        </>
    );
}

