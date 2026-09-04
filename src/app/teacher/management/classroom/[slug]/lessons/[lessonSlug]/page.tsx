import TablePayment from "@/components/dashboard/payment-history/TablePayment";
import ManagamentHeaderDetails from "@/components/teacher/management/ManagamentHeaderDetails";

export async function generateStaticParams() {
    return [
        { slug: 'hydra-facial', lessonSlug: 'lesson-1' },
    ];
}

export default async function LessonDetailsClassroomPage({
    params,
}: {
    params: Promise<{ slug: string; lessonSlug: string }>;
}) {
    const { slug } = await params;

    return (
        <section style={{ padding: '36px 60px 48px', backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1670px', margin: '0 auto' }}>
                <ManagamentHeaderDetails
                    title="Module 01_lessons 01:"
                    description="Learn the essential techniques behind professional deep cleansing and exfoliation. This lesson covers proper skin preparation, product application, handpiece control, and key safety considerations to help you perform the treatment with confidence and precision."
                    backHref={`/teacher/management/classroom/${slug}`}
                    trainerName="John Doe"
                    trainerAvatar="/images/kathleen.png"
                    trainerRating="4.9/5.0"
                    showTrainer
                    showTrainerRating
                    showBackButton
                    backAriaLabel="Back to classroom management"
                />
                <div style={{ marginTop: '40px' }}>
                    <TablePayment
                        variant="submission"
                        col1Title="NAME STUDENT"
                        col2Title="SUBMITTED AT"
                        col3Title="SCORE"
                        col4Title="ATTEMPTS"
                        col5Title="STATUS"
                    />
                </div>
            </div>
        </section>
    );
}