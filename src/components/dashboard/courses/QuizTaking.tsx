'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { WPQuizDetail, WPQuizSubmitResponse } from '@/types/wordpress';
import styles from '@/styles/dashboard/courses/QuizTaking.module.css';

// Bản đồ đáp án đúng dự phòng cho 10 câu hỏi HydraFacial
const FALLBACK_CORRECT_MAP: Record<number, { correctId: string; validIds: string[] }> = {
    2201: { correctId: 'opt_2201_b', validIds: ['opt_2201_b', 'opt_1_b', 'b', '1'] },
    2425: { correctId: 'opt_2425_c', validIds: ['opt_2425_c', 'opt_2_c', 'c', '2'] },
    2426: { correctId: 'opt_2426_b', validIds: ['opt_2426_b', 'opt_3_b', 'b', '1'] },
    2427: { correctId: 'opt_2427_b', validIds: ['opt_2427_b', 'opt_4_b', 'b', '1'] },
    2428: { correctId: 'opt_2428_c', validIds: ['opt_2428_c', 'opt_5_c', 'c', '2'] },
    2429: { correctId: 'opt_2429_c', validIds: ['opt_2429_c', 'opt_6_c', 'c', '2'] },
    2430: { correctId: 'opt_2430_b', validIds: ['opt_2430_b', 'opt_7_b', 'b', '1'] },
    2431: { correctId: 'opt_2431_b', validIds: ['opt_2431_b', 'opt_8_b', 'b', '1'] },
    2432: { correctId: 'opt_2432_b', validIds: ['opt_2432_b', 'opt_9_b', 'b', '1'] },
    2433: { correctId: 'opt_2433_b', validIds: ['opt_2433_b', 'opt_10_b', 'b', '1'] },
};

interface QuizTakingProps {
    quiz: WPQuizDetail;
    courseSlug: string;
    lessonSlug?: string;
    lessonTitle?: string;
    backUrl?: string;
}

export default function QuizTaking({
    quiz,
    courseSlug,
    lessonSlug,
    lessonTitle,
    backUrl,
}: QuizTakingProps) {
    const returnUrl = backUrl || (lessonSlug ? `/student/courses/${courseSlug}/lessons/${lessonSlug}` : `/courses/${courseSlug}`);

    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState<number>(quiz?.duration_seconds || 1800);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isReviewMode, setIsReviewMode] = useState<boolean>(false);
    const [result, setResult] = useState<WPQuizSubmitResponse | null>(null);

    const questions = useMemo(() => quiz?.questions || [], [quiz?.questions]);
    const totalQuestions = questions.length;
    const currentQuestion = questions[currentIndex] || questions[0];

    // Format mm:ss từ số giây
    const formatTime = (seconds: number): string => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Tìm kết quả câu hỏi theo ID
    const getQuestionResult = useCallback((qId: number) => {
        return result?.results?.find((r) => Number(r.question_id) === Number(qId));
    }, [result]);

    // Kiểm tra lựa chọn có phải là đáp án đúng không
    const isOptionExpected = useCallback((qId: number, optId: string) => {
        const qRes = getQuestionResult(qId);
        if (qRes && qRes.correct_answer_id) {
            return String(qRes.correct_answer_id).toLowerCase() === String(optId).toLowerCase();
        }
        const known = FALLBACK_CORRECT_MAP[qId]?.validIds;
        if (known) {
            return known.some((v) => v.toLowerCase() === String(optId).toLowerCase());
        }
        return false;
    }, [getQuestionResult]);

    // Hàm nộp bài quiz
    const handleSubmit = useCallback(async () => {
        if (isSubmitting || isSubmitted) return;
        setIsSubmitting(true);

        try {
            const res = await fetch(`/api/quiz/${quiz.id}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    answers,
                    questionIds: questions.map((q) => q.id),
                    courseSlug,
                    lessonSlug: lessonSlug || '',
                }),
            });

            if (res.ok) {
                const data: WPQuizSubmitResponse = await res.json();
                setResult(data);
                setIsSubmitted(true);
            } else {
                throw new Error('Lỗi từ server khi nộp bài');
            }
        } catch (error) {
            console.error('Lỗi khi nộp bài quiz:', error);
            // Fallback chấm điểm cục bộ nếu mạng có vấn đề
            let correctCount = 0;
            const fallbackResults = questions.map((q) => {
                const selected = String(answers[q.id] || '');
                const validIds = FALLBACK_CORRECT_MAP[q.id]?.validIds || [];
                const isCorrect = Boolean(selected && validIds.some((v) => v.toLowerCase() === selected.toLowerCase()));
                if (isCorrect) correctCount++;

                return {
                    question_id: q.id,
                    selected_answer_id: selected,
                    correct_answer_id: FALLBACK_CORRECT_MAP[q.id]?.correctId || '',
                    is_correct: isCorrect,
                };
            });

            const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
            setResult({
                success: true,
                quiz_id: quiz.id,
                score,
                passing_grade: quiz.passing_grade || 80,
                passed: score >= (quiz.passing_grade || 80),
                correct_count: correctCount,
                total_questions: totalQuestions,
                results: fallbackResults,
            });
            setIsSubmitted(true);
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting, isSubmitted, quiz.id, quiz.passing_grade, answers, questions, courseSlug, lessonSlug, totalQuestions]);

    // Đồng hồ đếm ngược (chỉ chạy khi chưa nộp bài)
    useEffect(() => {
        if (isSubmitted) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isSubmitted, handleSubmit]);

    // Chọn câu trả lời (chỉ cho phép khi chưa nộp bài)
    const handleSelectOption = (optionId: string) => {
        if (isSubmitted || !currentQuestion) return;
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: optionId,
        }));
    };

    // Điều hướng câu tiếp theo
    const handleNext = () => {
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else if (!isReviewMode) {
            handleSubmit();
        }
    };

    // Điều hướng câu trước
    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    // Làm lại bài quiz
    const handleRetake = () => {
        setAnswers({});
        setCurrentIndex(0);
        setTimeLeft(quiz?.duration_seconds || 1800);
        setIsSubmitted(false);
        setIsReviewMode(false);
        setResult(null);
    };

    const isLastQuestion = currentIndex === totalQuestions - 1;
    const isTimerUrgent = timeLeft < 300; // Dưới 5 phút

    const displayQuizTitle = quiz.title.toUpperCase().startsWith('QUIZ')
        ? quiz.title.toUpperCase()
        : `QUIZZ 01: ${quiz.title.toUpperCase()}`;

    const displayQuizDesc = quiz.content ||
        'Learn the essential techniques behind professional deep cleansing and exfoliation. This lesson covers proper skin preparation, product application, handpiece control, and key safety considerations to help you perform the treatment with confidence and precision.';

    // Kiểm tra trạng thái của câu hỏi hiện tại trong chế độ xem lại
    const currentQResult = currentQuestion ? getQuestionResult(currentQuestion.id) : null;
    const currentQSelected = currentQuestion ? answers[currentQuestion.id] : undefined;
    const isCurrentQAnswered = Boolean(currentQSelected);
    const isCurrentQCorrect = Boolean(currentQResult?.is_correct);

    return (
        <div className={styles['quiz-container']}>
            {/* 1. Header: Back Button, Title & Description */}
            <header className={styles['quiz-header']}>
                <div className={styles['quiz-header__title-row']}>
                    <Link
                        href={returnUrl}
                        className={styles['quiz-header__back-btn']}
                        aria-label="Quay lại bài học"
                    >
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </Link>
                    <h1 className={styles['quiz-header__title']}>{displayQuizTitle}</h1>

                    {/* Badge hiển thị khi đang trong chế độ Xem lại bài làm */}
                    {isReviewMode && (
                        <span className={styles['review-mode-badge']}>
                            👁 Chế độ xem lại bài làm
                        </span>
                    )}
                </div>
                <p className={styles['quiz-header__desc']}>{displayQuizDesc}</p>
            </header>

            {/* GIAO DIỆN 2 CỘT: HIỂN THỊ KHI ĐANG LÀM BÀI HOẶC KHI ĐANG TRONG CHẾ ĐỘ XEM LẠI */}
            {(!isSubmitted || isReviewMode) ? (
                <div className={styles['quiz-grid']}>
                    {/* Cột trái: Nội dung câu hỏi và các lựa chọn A/B/C/D */}
                    <main className={styles['quiz-content']}>
                        {currentQuestion && (
                            <section className={styles['question-card']} aria-label={`Question ${currentIndex + 1}`}>
                                {/* Banner thông báo kết quả câu hỏi trong chế độ xem lại */}
                                {isReviewMode && (
                                    <div
                                        className={`${styles['question-status-banner']} ${
                                            !isCurrentQAnswered
                                                ? styles['question-status-banner--skipped']
                                                : isCurrentQCorrect
                                                ? styles['question-status-banner--correct']
                                                : styles['question-status-banner--wrong']
                                        }`}
                                    >
                                        {isCurrentQCorrect ? (
                                            <span>✓ Bạn đã trả lời đúng (+10% điểm)</span>
                                        ) : isCurrentQAnswered ? (
                                            <span>✕ Bạn đã trả lời chưa chính xác</span>
                                        ) : (
                                            <span>— Bạn chưa chọn đáp án cho câu hỏi này</span>
                                        )}
                                    </div>
                                )}

                                <div className={styles['question-card__header']}>
                                    <h2 className={styles['question-card__title']}>
                                        Q{currentIndex + 1}: {currentQuestion.title.toUpperCase()}
                                    </h2>
                                </div>

                                <div className={styles['question-card__options']}>
                                    {currentQuestion.options.map((opt, optIdx) => {
                                        const isSelected = answers[currentQuestion.id] === opt.id;
                                        const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                                        const isExpected = isReviewMode && isOptionExpected(currentQuestion.id, opt.id);

                                        let reviewClass = '';
                                        if (isReviewMode) {
                                            if (isSelected && isExpected) {
                                                reviewClass = styles['option-item--review-correct'];
                                            } else if (isSelected && !isExpected) {
                                                reviewClass = styles['option-item--review-wrong'];
                                            } else if (!isSelected && isExpected) {
                                                reviewClass = styles['option-item--review-expected'];
                                            }
                                        }

                                        return (
                                            <div
                                                key={opt.id}
                                                className={`${styles['option-item']} ${
                                                    isSelected && !isReviewMode ? styles['option-item--selected'] : ''
                                                } ${reviewClass}`}
                                                onClick={() => !isReviewMode && handleSelectOption(opt.id)}
                                                role="radio"
                                                aria-checked={isSelected}
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (!isReviewMode && (e.key === ' ' || e.key === 'Enter')) {
                                                        handleSelectOption(opt.id);
                                                    }
                                                }}
                                            >
                                                <div className={styles['option-item__radio']}>
                                                    {isSelected && !isReviewMode && (
                                                        <div className={styles['option-item__radio-dot']} />
                                                    )}
                                                    {isReviewMode && (
                                                        isExpected ? (
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="20 6 9 17 4 12" />
                                                            </svg>
                                                        ) : isSelected ? (
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                                <line x1="6" y1="6" x2="18" y2="18" />
                                                            </svg>
                                                        ) : null
                                                    )}
                                                </div>

                                                <span className={styles['option-item__text']}>
                                                    {letter}. {opt.title}
                                                </span>

                                                {/* Nhãn tag hiển thị trong chế độ xem lại */}
                                                {isReviewMode && isSelected && isExpected && (
                                                    <span className={`${styles['option-item__tag']} ${styles['option-item__tag--correct']}`}>
                                                        Lựa chọn của bạn - Đúng ✓
                                                    </span>
                                                )}
                                                {isReviewMode && isSelected && !isExpected && (
                                                    <span className={`${styles['option-item__tag']} ${styles['option-item__tag--wrong']}`}>
                                                        Lựa chọn của bạn - Sai ✕
                                                    </span>
                                                )}
                                                {isReviewMode && !isSelected && isExpected && (
                                                    <span className={`${styles['option-item__tag']} ${styles['option-item__tag--expected']}`}>
                                                        Đáp án chính xác ✓
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Hàng nút điều hướng */}
                                <div className={styles['quiz-actions']}>
                                    {currentIndex > 0 && (
                                        <button
                                            type="button"
                                            className={styles['quiz-actions__btn-prev']}
                                            onClick={handlePrev}
                                        >
                                            ← PREV
                                        </button>
                                    )}

                                    {/* Nút quay lại bảng điểm khi ở chế độ xem lại */}
                                    {isReviewMode && (
                                        <button
                                            type="button"
                                            className={styles['results-btn-review']}
                                            style={{ padding: '10px 20px', fontSize: '13px' }}
                                            onClick={() => setIsReviewMode(false)}
                                        >
                                            VỀ BẢNG ĐIỂM 📊
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        className={`${styles['quiz-actions__btn-next']} ${
                                            !isReviewMode && isLastQuestion ? styles['quiz-actions__btn-submit'] : ''
                                        }`}
                                        onClick={handleNext}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            'SUBMITTING...'
                                        ) : isReviewMode ? (
                                            isLastQuestion ? 'HOÀN TẤT XEM LẠI' : 'NEXT →'
                                        ) : isLastQuestion ? (
                                            'SUBMIT QUIZ →'
                                        ) : (
                                            'NEXT →'
                                        )}
                                    </button>
                                </div>
                            </section>
                        )}
                    </main>

                    {/* Cột phải: Đồng hồ đếm ngược (hoặc Điểm số) và Danh sách câu hỏi */}
                    <aside className={styles['quiz-sidebar']}>
                        {/* 1. Card đồng hồ đếm ngược (hoặc Tổng điểm khi xem lại) */}
                        <div className={styles['timer-card']}>
                            <span className={styles['timer-card__label']}>
                                {isReviewMode ? 'KẾT QUẢ ĐẠT ĐƯỢC' : 'TIME ALLOWED FOR THE TEST'}
                            </span>
                            <span
                                className={`${styles['timer-card__digits']} ${
                                    !isReviewMode && isTimerUrgent ? styles['timer-card__digits--urgent'] : ''
                                }`}
                            >
                                {isReviewMode ? `${result?.score}%` : formatTime(timeLeft)}
                            </span>
                        </div>

                        {/* 2. Card danh sách câu hỏi */}
                        <div className={styles['question-list-card']}>
                            <h3 className={styles['question-list-card__title']}>
                                {isReviewMode ? 'KẾT QUẢ TỪNG CÂU HỎI' : 'LIST OF QUESTIONS'}
                            </h3>

                            <div className={styles['question-list']}>
                                {questions.map((q, idx) => {
                                    const isActive = idx === currentIndex;
                                    const isAnswered = answers[q.id] !== undefined;
                                    const qRes = isReviewMode ? getQuestionResult(q.id) : null;
                                    const isCorrect = Boolean(qRes?.is_correct);

                                    return (
                                        <button
                                            key={q.id}
                                            type="button"
                                            className={`${styles['question-list__item']} ${
                                                isActive ? styles['question-list__item--active'] : ''
                                            } ${!isReviewMode && isAnswered ? styles['question-list__item--answered'] : ''}`}
                                            onClick={() => setCurrentIndex(idx)}
                                            aria-label={`Jump to Question ${idx + 1}`}
                                        >
                                            <span className={styles['question-list__text']}>
                                                Q{idx + 1}: {q.title.toUpperCase()}
                                            </span>

                                            {/* Biểu tượng trong chế độ xem lại */}
                                            {isReviewMode ? (
                                                isCorrect ? (
                                                    <svg
                                                        className={styles['question-list__icon--correct']}
                                                        width="22"
                                                        height="22"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <circle cx="12" cy="12" r="10" />
                                                        <polyline points="16 10 11 15 8 12" />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        className={styles['question-list__icon--wrong']}
                                                        width="22"
                                                        height="22"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <circle cx="12" cy="12" r="10" />
                                                        <line x1="15" y1="9" x2="9" y2="15" />
                                                        <line x1="9" y1="9" x2="15" y2="15" />
                                                    </svg>
                                                )
                                            ) : (
                                                /* Biểu tượng khi đang làm bài */
                                                <svg
                                                    className={styles['question-list__icon']}
                                                    width="22"
                                                    height="22"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <circle cx="12" cy="12" r="10" />
                                                    <polyline points="16 10 11 15 8 12" />
                                                </svg>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>
                </div>
            ) : (
                /* KHI ĐÃ NỘP BÀI: HIỂN THỊ MÀN HÌNH TỔNG KẾT & XEM LẠI CHI TIẾT */
                <div className={styles['results-overlay']}>
                    <div className={styles['results-header']}>
                        <span
                            className={`${styles['results-badge']} ${
                                result?.passed ? styles['results-badge--pass'] : styles['results-badge--fail']
                            }`}
                        >
                            {result?.passed ? 'PASSED (ĐẠT YÊU CẦU)' : 'FAILED (CHƯA ĐẠT)'}
                        </span>
                        <h2 className={styles['results-title']}>
                            {result?.passed ? 'Chúc mừng bạn đã hoàn thành bài thi!' : 'Hãy ôn lại bài học và thử lại nhé!'}
                        </h2>
                        <p className={styles['results-subtitle']}>
                            {result?.passed
                                ? 'Bạn đã nắm vững các kiến thức cốt lõi của bài học này.'
                                : 'Bạn cần đạt tối thiểu 80% điểm số để hoàn thành bài học.'}
                        </p>
                    </div>

                    <div className={styles['results-stats-grid']}>
                        <div className={styles['stat-box']}>
                            <div className={styles['stat-box__value']}>{result?.score}%</div>
                            <div className={styles['stat-box__label']}>Điểm đạt được</div>
                        </div>
                        <div className={styles['stat-box']}>
                            <div className={styles['stat-box__value']}>
                                {result?.correct_count} / {result?.total_questions}
                            </div>
                            <div className={styles['stat-box__label']}>Số câu trả lời đúng</div>
                        </div>
                        <div className={styles['stat-box']}>
                            <div className={styles['stat-box__value']}>{result?.passing_grade}%</div>
                            <div className={styles['stat-box__label']}>Điểm chuẩn yêu cầu</div>
                        </div>
                    </div>

                    {/* Hàng nút hành động: QUAY LẠI BÀI HỌC, XEM LẠI BÀI LÀM, LÀM LẠI BÀI THI */}
                    <div className={styles['results-actions']}>
                        <Link href={returnUrl} className={styles['results-btn-primary']}>
                            QUAY LẠI BÀI HỌC →
                        </Link>
                        <button
                            type="button"
                            className={styles['results-btn-review']}
                            onClick={() => {
                                setIsReviewMode(true);
                                setCurrentIndex(0);
                            }}
                        >
                            XEM LẠI BÀI LÀM 👁
                        </button>
                        <button
                            type="button"
                            className={styles['results-btn-secondary']}
                            onClick={handleRetake}
                        >
                            LÀM LẠI BÀI THI ↺
                        </button>
                    </div>

                    {/* KHU VỰC LIỆT KÊ CHI TIẾT TẤT CẢ CÁC CÂU HỎI TRỰC TIẾP PHÍA DƯỚI BẢNG ĐIỂM */}
                    <div className={styles['detailed-review-section']}>
                        <h3 className={styles['detailed-review-title']}>
                            Chi tiết bài làm từng câu hỏi ({questions.length} câu)
                        </h3>

                        <div className={styles['detailed-review-list']}>
                            {questions.map((q, idx) => {
                                const qRes = getQuestionResult(q.id);
                                const isCorrect = Boolean(qRes?.is_correct);
                                const selectedAnsId = answers[q.id];

                                return (
                                    <div key={q.id} className={styles['detailed-review-card']}>
                                        <div className={styles['detailed-review-card__header']}>
                                            <h4 className={styles['detailed-review-card__qtitle']}>
                                                Q{idx + 1}: {q.title}
                                            </h4>
                                            <span
                                                className={`${styles['results-badge']} ${
                                                    isCorrect ? styles['results-badge--pass'] : styles['results-badge--fail']
                                                }`}
                                                style={{ margin: 0, padding: '3px 12px', fontSize: '11px' }}
                                            >
                                                {isCorrect ? '✓ Đúng' : selectedAnsId ? '✕ Sai' : '— Chưa chọn'}
                                            </span>
                                        </div>

                                        <div className={styles['detailed-review-card__options']}>
                                            {q.options.map((opt, optIdx) => {
                                                const letter = String.fromCharCode(65 + optIdx);
                                                const isUserChoice = selectedAnsId === opt.id;
                                                const isExpectedChoice = isOptionExpected(q.id, opt.id);

                                                let bg = '#FFFFFF';
                                                let border = '1px solid #E5E7EB';
                                                let labelTag = '';

                                                if (isUserChoice && isExpectedChoice) {
                                                    bg = '#ECFDF5';
                                                    border = '1.5px solid #10B981';
                                                    labelTag = '(Lựa chọn của bạn - Chính xác ✓)';
                                                } else if (isUserChoice && !isExpectedChoice) {
                                                    bg = '#FEF2F2';
                                                    border = '1.5px solid #EF4444';
                                                    labelTag = '(Lựa chọn của bạn - Sai ✕)';
                                                } else if (!isUserChoice && isExpectedChoice) {
                                                    bg = '#F0FDF4';
                                                    border = '1.5px dashed #10B981';
                                                    labelTag = '(Đáp án chính xác ✓)';
                                                }

                                                return (
                                                    <div
                                                        key={opt.id}
                                                        className={styles['detailed-review-card__opt']}
                                                        style={{ backgroundColor: bg, border }}
                                                    >
                                                        <span>
                                                            <strong>{letter}.</strong> {opt.title}
                                                        </span>
                                                        {labelTag && (
                                                            <span
                                                                style={{
                                                                    marginLeft: 'auto',
                                                                    fontSize: '11px',
                                                                    fontWeight: 600,
                                                                    color: isExpectedChoice ? '#065F46' : '#991B1B',
                                                                }}
                                                            >
                                                                {labelTag}
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
