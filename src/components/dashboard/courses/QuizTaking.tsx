'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { WPQuizDetail, WPQuizSubmitResponse } from '@/types/wordpress';
import { getStoredUserSession } from '@/lib/auth-client';
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
    courseId?: number | string;
    lessonSlug?: string;
    lessonTitle?: string;
    backUrl?: string;
}

export default function QuizTaking({
    quiz,
    courseSlug,
    courseId,
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
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const [expandedQuestionIds, setExpandedQuestionIds] = useState<Record<number, boolean>>({});

    const toggleQuestionExpand = (qId: number) => {
        setExpandedQuestionIds((prev) => ({
            ...prev,
            [qId]: !prev[qId],
        }));
    };

    // Dùng Ref để tính chính xác thời gian làm bài, không bị stale closure hay lệch setInterval
    const quizStartTimeRef = React.useRef<number>(Date.now());

    // Khởi tạo và đồng bộ thời gian bắt đầu làm quiz (tránh mất khi refresh trang)
    useEffect(() => {
        if (!quiz?.id) return;
        const key = `lp_quiz_start_${quiz.id}`;
        const stored = typeof window !== 'undefined' ? sessionStorage.getItem(key) : null;
        if (stored && !isSubmitted) {
            const parsed = Number(stored);
            if (!isNaN(parsed) && parsed > 0 && parsed <= Date.now()) {
                quizStartTimeRef.current = parsed;
                return;
            }
        }
        if (!isSubmitted && typeof window !== 'undefined') {
            sessionStorage.setItem(key, String(Date.now()));
            quizStartTimeRef.current = Date.now();
        }
    }, [quiz?.id, isSubmitted]);

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

        const user = getStoredUserSession();
        const duration = quiz?.duration_seconds || 1800;
        const now = Date.now();
        const elapsedSec = Math.max(1, Math.min(duration, Math.round((now - quizStartTimeRef.current) / 1000)));
        const timeSpend = formatTime(elapsedSec);
        const startTimeStr = new Date(quizStartTimeRef.current).toISOString().slice(0, 19).replace('T', ' ');
        const targetCourseId = courseId || (quiz as any)?.course_id || (quiz as any)?.courseId || 0;

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
                    courseId: targetCourseId,
                    quizSlug: quiz.slug || '',
                    lessonSlug: lessonSlug || '',
                    userId: user?.id,
                    userEmail: user?.email,
                    timeSpend,
                    timeSpentSeconds: elapsedSec,
                    startTime: startTimeStr,
                }),
            });

            if (res.ok) {
                const data: WPQuizSubmitResponse = await res.json();
                if (!data.time_spend) {
                    data.time_spend = timeSpend;
                }
                setResult(data);
                setIsSubmitted(true);
                if (typeof window !== 'undefined') {
                    sessionStorage.removeItem(`lp_quiz_start_${quiz.id}`);
                }
                if (data.passed) {
                    try {
                        const saved = localStorage.getItem('lp_completed_courses');
                        let list: string[] = [];
                        if (saved) {
                            try { list = JSON.parse(saved); } catch { list = []; }
                        }
                        if (courseSlug && !list.includes(courseSlug)) list.push(courseSlug);
                        localStorage.setItem('lp_completed_courses', JSON.stringify(list));

                        const finalCourseId = targetCourseId || data.course_id || (quiz as any)?.course_id || (quiz as any)?.courseId;
                        fetch('/api/courses/complete', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                courseSlug,
                                courseId: finalCourseId,
                            }),
                        }).catch(() => null);
                    } catch {
                        // ignore
                    }
                }
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
            const isPassed = score >= (quiz.passing_grade || 80);
            setResult({
                success: true,
                quiz_id: quiz.id,
                score,
                passing_grade: quiz.passing_grade || 80,
                passed: isPassed,
                correct_count: correctCount,
                total_questions: totalQuestions,
                results: fallbackResults,
            });
            setIsSubmitted(true);
            if (isPassed) {
                try {
                    const saved = localStorage.getItem('lp_completed_courses');
                    let list: string[] = [];
                    if (saved) {
                        try { list = JSON.parse(saved); } catch { list = []; }
                    }
                    if (courseSlug && !list.includes(courseSlug)) list.push(courseSlug);
                    localStorage.setItem('lp_completed_courses', JSON.stringify(list));

                    fetch('/api/courses/complete', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            courseSlug,
                            courseId: (quiz as any).course_id || (quiz as any).courseId,
                        }),
                    }).catch(() => null);
                } catch {
                    // ignore
                }
            }
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

    // Xác định quyền Retake (Làm lại bài thi) theo chuẩn LearnPress
    // Quy tắc: Không có giá trị retake mặc định không cho phép học viên làm lại bài quiz
    const canRetake = useMemo(() => {
        if (result && typeof result.can_retake !== 'undefined') {
            return Boolean(result.can_retake);
        }
        if (quiz?.retake_count === -1) return true;
        if (quiz?.retake_count && quiz.retake_count > 0) {
            return typeof quiz.can_retake !== 'undefined' ? Boolean(quiz.can_retake) : true;
        }
        return false;
    }, [result, quiz?.retake_count, quiz?.can_retake]);

    const retakesLeft = useMemo(() => {
        if (result && typeof result.retakes_left !== 'undefined') {
            return result.retakes_left;
        }
        if (quiz && typeof quiz.retakes_left !== 'undefined') {
            return quiz.retakes_left;
        }
        if (quiz?.retake_count === -1) return -1;
        return 0;
    }, [result, quiz?.retakes_left, quiz?.retake_count]);

    // Làm lại bài quiz
    const handleRetake = () => {
        if (!canRetake) {
            alert('Bài kiểm tra này không cho phép làm lại bài thi (Cấu hình Retake LearnPress: 0).');
            return;
        }
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(`lp_quiz_start_${quiz.id}`, String(Date.now()));
        }
        quizStartTimeRef.current = Date.now();
        setAnswers({});
        setCurrentIndex(0);
        setTimeLeft(quiz?.duration_seconds || 1800);
        setIsSubmitted(false);
        setIsReviewMode(false);
        setShowPreview(false);
        setExpandedQuestionIds({});
        setResult(null);
    };

    const isLastQuestion = currentIndex === totalQuestions - 1;
    const isTimerUrgent = timeLeft < 300; // Dưới 5 phút

    const displayQuizTitle = quiz.title.toUpperCase().startsWith('QUIZ')
        ? quiz.title.toUpperCase()
        : `QUIZZ 01: ${quiz.title.toUpperCase()}`;

    const displayQuizDesc = useMemo(() => {
        if (!quiz?.content) {
            return 'Learn the essential techniques behind professional deep cleansing and exfoliation. This lesson covers proper skin preparation, product application, handpiece control, and key safety considerations to help you perform the treatment with confidence and precision.';
        }
        const stripped = quiz.content.replace(/<[^>]*>/g, '').trim();
        return stripped || 'Learn the essential techniques behind professional deep cleansing and exfoliation. This lesson covers proper skin preparation, product application, handpiece control, and key safety considerations to help you perform the treatment with confidence and precision.';
    }, [quiz?.content]);

    // Số câu trả lời đúng
    const correctCount = useMemo(() => {
        if (result && typeof result.correct_count !== 'undefined') {
            return result.correct_count;
        }
        return questions.filter((q) => {
            const qRes = getQuestionResult(q.id);
            if (qRes) return Boolean(qRes.is_correct);
            const selected = answers[q.id];
            return Boolean(
                selected &&
                FALLBACK_CORRECT_MAP[q.id]?.validIds.some(
                    (v) => v.toLowerCase() === selected.toLowerCase()
                )
            );
        }).length;
    }, [result, questions, answers, getQuestionResult]);

    // Điểm số hiển thị
    const displayScore = useMemo(() => {
        if (result && typeof result.score !== 'undefined') {
            return result.score;
        }
        if (totalQuestions > 0) {
            return Math.round((correctCount / totalQuestions) * 100);
        }
        return 0;
    }, [result, correctCount, totalQuestions]);

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
                </div>
                <p className={styles['quiz-header__desc']}>{displayQuizDesc}</p>
            </header>

            {/* GIAO DIỆN HIỂN THỊ: ĐANG LÀM BÀI HOẶC ĐÃ NỘP BÀI */}
            {!isSubmitted ? (
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
                /* KHI ĐÃ NỘP BÀI: GIAO DIỆN NỘP BÀI THEO MẪU MOCKUP */
                <div className={styles['results-layout']}>
                    {/* CỘT TRÁI: TIÊU ĐỀ, DANH SÁCH CÂU HỎI, TỔNG KẾT VÀ NÚT HÀNH ĐỘNG */}
                    <div className={styles['results-left-col']}>
                        {/* Banner thông báo đạt điều kiện nhận chứng chỉ nếu có */}
                        {result?.passed && (
                            <div className={styles['certificate-banner']}>
                                <div className={styles['certificate-banner-content']}>
                                    <span className={styles['certificate-banner-icon']}>🎓</span>
                                    <div>
                                        <strong>Chúc mừng bạn đã hoàn thành xuất sắc bài thi!</strong>
                                        <p>Bạn đã vượt qua bài kiểm tra và đủ điều kiện xem chứng chỉ.</p>
                                    </div>
                                </div>
                                <Link href="/student/certificate" className={styles['certificate-banner-btn']}>
                                    XEM CHỨNG CHỈ 📜
                                </Link>
                            </div>
                        )}

                        {/* Tiêu đề phần kết quả câu hỏi */}
                        <h2 className={styles['answers-results-title']}>ANSWERS AND RESULTS</h2>

                        {/* Danh sách từng câu hỏi theo định dạng Q1: ... kèm icon đúng/sai */}
                        <div className={styles['result-questions-list']}>
                            {questions.map((q, idx) => {
                                const qRes = getQuestionResult(q.id);
                                const selectedAnsId = answers[q.id];
                                const isCorrect = Boolean(
                                    qRes ? qRes.is_correct : (
                                        selectedAnsId &&
                                        FALLBACK_CORRECT_MAP[q.id]?.validIds.some(
                                            (v) => v.toLowerCase() === selectedAnsId.toLowerCase()
                                        )
                                    )
                                );
                                const isExpanded = Boolean(expandedQuestionIds[q.id]);

                                return (
                                    <div key={q.id} className={styles['result-question-item']}>
                                        <div
                                            className={styles['result-question-row']}
                                            onClick={() => toggleQuestionExpand(q.id)}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === ' ' || e.key === 'Enter') {
                                                    toggleQuestionExpand(q.id);
                                                }
                                            }}
                                            aria-expanded={showPreview || isExpanded}
                                            title="Nhấp để xem các lựa chọn và đáp án chi tiết"
                                        >
                                            <span className={styles['result-question-title']}>
                                                Q{idx + 1}: {q.title ? q.title.toUpperCase() : `QUESTION ${idx + 1}`}
                                            </span>
                                            <div className={styles['result-question-icon']}>
                                                {isCorrect ? (
                                                    <svg
                                                        className={styles['icon-correct']}
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2.2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <circle cx="12" cy="12" r="9" />
                                                        <polyline points="8.5 12.5 11 15 15.5 9.5" />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        className={styles['icon-wrong']}
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2.2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <line x1="18" y1="6" x2="6" y2="18" />
                                                        <line x1="6" y1="6" x2="18" y2="18" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>

                                        {/* Chi tiết lựa chọn A/B/C/D khi xem trước (Preview) hoặc nhấp mở rộng */}
                                        {(showPreview || isExpanded) && (
                                            <div className={styles['result-question-options']}>
                                                {q.options.map((opt, optIdx) => {
                                                    const letter = String.fromCharCode(65 + optIdx);
                                                    const isSelected = selectedAnsId === opt.id;
                                                    const isExpected = isOptionExpected(q.id, opt.id);

                                                    let optClass = styles['preview-opt'];
                                                    if (isSelected && isExpected) optClass += ` ${styles['preview-opt--correct']}`;
                                                    else if (isSelected && !isExpected) optClass += ` ${styles['preview-opt--wrong']}`;
                                                    else if (!isSelected && isExpected) optClass += ` ${styles['preview-opt--expected']}`;

                                                    return (
                                                        <div key={opt.id} className={optClass}>
                                                            <span className={styles['preview-opt-letter']}>{letter}.</span>
                                                            <span className={styles['preview-opt-text']}>{opt.title}</span>
                                                            {isSelected && isExpected && (
                                                                <span className={styles['preview-opt-tag-correct']}>
                                                                    Lựa chọn của bạn - Đúng ✓
                                                                </span>
                                                            )}
                                                            {isSelected && !isExpected && (
                                                                <span className={styles['preview-opt-tag-wrong']}>
                                                                    Lựa chọn của bạn - Sai ✕
                                                                </span>
                                                            )}
                                                            {!isSelected && isExpected && (
                                                                <span className={styles['preview-opt-tag-expected']}>
                                                                    Đáp án đúng ✓
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Thanh tổng kết kết quả: SUMMARY RESULTS ------------ 19/25 question */}
                        <div className={styles['summary-results-bar']}>
                            <span className={styles['summary-results-label']}>SUMMARY RESULTS</span>
                            <span className={styles['summary-results-count']}>
                                {correctCount}/{totalQuestions} question
                            </span>
                        </div>

                        {/* Hàng nút hành động: PREVIEW RESULTS | BACK TO COURSES → | NEXT LESSON */}
                        <div className={styles['results-actions-row']}>
                            <button
                                type="button"
                                className={styles['btn-outline-gold']}
                                onClick={() => setShowPreview((prev) => !prev)}
                            >
                                {showPreview ? 'HIDE DETAILS' : 'PREVIEW RESULTS'}
                            </button>

                            <div className={styles['results-actions-right']}>
                                {canRetake && (
                                    <button
                                        type="button"
                                        className={styles['btn-outline-gold']}
                                        onClick={handleRetake}
                                        title="Làm lại bài thi"
                                    >
                                        RETAKE QUIZ ↺ {retakesLeft > 0 ? `(${retakesLeft})` : ''}
                                    </button>
                                )}
                                <Link href={returnUrl} className={styles['btn-outline-gold']}>
                                    BACK TO COURSES →
                                </Link>
                                <Link href={returnUrl} className={styles['btn-solid-dark']}>
                                    NEXT LESSON
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI: HUY HIỆU ĐIỂM SỐ HÌNH TRÒN LỒNG NHAU */}
                    <div className={styles['results-right-col']}>
                        <div className={styles['score-circle-wrapper']}>
                            <div className={styles['score-circle-outer']}>
                                <div className={styles['score-circle-value']}>
                                    {displayScore}/100
                                </div>
                                <div className={styles['score-circle-label']}>
                                    score
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
