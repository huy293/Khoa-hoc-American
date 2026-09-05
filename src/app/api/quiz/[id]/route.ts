import { NextRequest, NextResponse } from 'next/server';
import { getWpQuizById } from '@/lib/wordpress-queries';
import { WPQuizDetail } from '@/types/wordpress';

// Bộ câu hỏi mẫu chuẩn cho Quiz HydraFacial (Khớp 100% với screenshot và bài học AMC)
const FALLBACK_HYDRAFACIAL_QUIZ: WPQuizDetail = {
  id: 2188,
  title: 'QUIZZ 01: INTRODUCTION TO HYDRAFACIAL TECHNOLOGY',
  content:
    'Learn the essential techniques behind professional deep cleansing and exfoliation. This lesson covers proper skin preparation, product application, handpiece control, and key safety considerations to help you perform the treatment with confidence and precision.',
  duration_seconds: 1800, // 30:00
  passing_grade: 80,
  questions_count: 5,
  questions: [
    {
      id: 2201,
      title: 'WHAT IS THE MAIN PURPOSE OF THE CLEANSING AND EXFOLIATION STEP IN A HYDRAFACIAL TREATMENT?',
      content: '',
      type: 'single_choice',
      options: [
        { id: 'opt_1_a', title: 'Tighten facial muscles' },
        { id: 'opt_1_b', title: 'Remove dead skin cells and surface impurities' },
        { id: 'opt_1_c', title: 'Reduce facial movement' },
        { id: 'opt_1_d', title: 'Close the pores' },
      ],
    },
    {
      id: 2425,
      title: 'WHAT IS THE PRIMARY MECHANISM OF THE HYDRAFACIAL VORTEX-FUSION TECHNOLOGY?',
      content: '',
      type: 'single_choice',
      options: [
        { id: 'opt_2_a', title: 'High-frequency ultrasonic soundwaves' },
        { id: 'opt_2_b', title: 'Micro-focused electrical stimulation' },
        { id: 'opt_2_c', title: 'Spiral tip creating a vortex effect to dislodge impurities while infusing serums' },
        { id: 'opt_2_d', title: 'Thermal coagulation of epidermal layers' },
      ],
    },
    {
      id: 2428,
      title: 'WHICH ACID IS COMMONLY USED IN HYDRAFACIAL PEEL SOLUTIONS FOR GENTLE RESURFACING?',
      content: '',
      type: 'single_choice',
      options: [
        { id: 'opt_3_a', title: 'Trichloroacetic acid (TCA 35%)' },
        { id: 'opt_3_b', title: 'Glycolic and Salicylic Acid blend' },
        { id: 'opt_3_c', title: 'Pure Carbolic Acid (Phenol)' },
        { id: 'opt_3_d', title: 'Pure Hydrochloric Acid' },
      ],
    },
    {
      id: 2430,
      title: 'WHAT IS THE PRIMARY FUNCTION OF THE SKIN BARRIER (STRATUM CORNEUM) PROTECTED DURING TREATMENT?',
      content: '',
      type: 'single_choice',
      options: [
        { id: 'opt_4_a', title: 'Facilitating trans-epidermal water evaporation' },
        { id: 'opt_4_b', title: 'Protecting against pathogens, chemicals, and preventing excessive transepidermal water loss' },
        { id: 'opt_4_c', title: 'Generating melanin deposits rapidly' },
        { id: 'opt_4_d', title: 'Absorbing ultraviolet radiation entirely' },
      ],
    },
    {
      id: 2431,
      title: 'WHICH STEP IN THE HYDRAFACIAL PROTOCOL DELIVERS ANTIOXIDANTS, PEPTIDES, AND HYALURONIC ACID?',
      content: '',
      type: 'single_choice',
      options: [
        { id: 'opt_5_a', title: 'Vortex-Extraction' },
        { id: 'opt_5_b', title: 'Vortex-Exfoliation' },
        { id: 'opt_5_c', title: 'Vortex-Fusion / Protect & Infuse' },
        { id: 'opt_5_d', title: 'Acid Peel Application' },
      ],
    },
  ],
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const quizId = Number(id) || 2188;

  try {
    // 1. Cố gắng lấy trực tiếp từ LearnPress qua hàm getWpQuizById
    const wpQuiz = await getWpQuizById(quizId);
    if (wpQuiz && wpQuiz.questions && wpQuiz.questions.length > 0) {
      return NextResponse.json({
        success: true,
        quiz: wpQuiz,
      });
    }
  } catch (error) {
    console.warn('Không thể tải quiz từ WordPress, sử dụng dữ liệu dự phòng:', error);
  }

  // 2. Fallback sang dữ liệu quiz chuẩn
  return NextResponse.json({
    success: true,
    quiz: {
      ...FALLBACK_HYDRAFACIAL_QUIZ,
      id: quizId,
    },
  });
}
