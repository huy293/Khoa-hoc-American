import MyCourses from "@/components/dashboard/home/MyCourses";
import LearningResources from "@/components/dashboard/home/LearningResources";

export default function DashboardShopPage() {
    return (
        <>
            <MyCourses
                tag="MY COURSES LIST"
                title="Let's explore the course together!"
                search={true}
                seemore={false}
                limit={8}
                loadmore={true}
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
