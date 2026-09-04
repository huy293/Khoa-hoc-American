import React from 'react';
import ManagamentHeaderDetails from '@/components/teacher/management/ManagamentHeaderDetails';
import TablePayment from '@/components/dashboard/payment-history/TablePayment';

export async function generateStaticParams() {
    return [{ slug: 'hydra-facial' }];
}

export default async function StudentDetailsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return (
        <section style={{ padding: '36px 60px 48px', backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1670px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                {/* 1. Header Details: Back button, Title, Description & Trainer info */}
                <ManagamentHeaderDetails
                    title="INTRODUCTION TO HYDRAFACIAL"
                    description="Learn the essential techniques behind professional deep cleansing and exfoliation. This lesson covers proper skin preparation, product application, handpiece control, and key safety considerations to help you perform the treatment with confidence and precision."
                    backHref="/teacher/management/students"
                    trainer={{
                        name: 'Kathleen trainer',
                        avatar: '/images/kathleen.png',
                        rating: '4.9/5.0',
                    }}
                    showTrainer
                    showTrainerRating
                    showBackButton
                    backAriaLabel="Back to students management"
                />

                {/* 2. Students Progress Table (6 columns matching screenshot) */}
                <TablePayment
                    variant="students"
                    col1Title="NAME STUDENT"
                    col2Title="PROGRESS"
                    col3Title="CURRENT LESSON"
                    col4Title="ASSIGNMENTS"
                    col5Title="LAST ACTIVE"
                    col6Title="QUIZ AVG."
                />
            </div>
        </section>
    );
}
