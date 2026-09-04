'use client';

import React from 'react';
import styles from '@/styles/dashboard/payment-history/PaymentHistoryContent.module.css';

/* ── Default Eye SVG Icon ── */
const DefaultEyeIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
            stroke="#8A7043"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3.2" stroke="#8A7043" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/* ── Invoice Item Interface ── */
export interface InvoiceItem {
    id: string;
    orderId: string;
    purchase: string;
    category?: string;
    date: string;
    payment: string;
    total: string;
    isHighlight?: boolean;
    customerName?: string;
    subtotal?: string;
    tax?: string;
}

/* ── Student Submission Interface (5 cột: Name, Submitted, Score, Attempts, Status) ── */
export interface StudentSubmissionItem {
    id: string | number;
    studentName: string;
    submittedAt: string;
    score: string;
    attempts: number | string;
    status: 'Passed' | 'Unfinished' | string;
}

/* ── Classroom Student Item Interface (6 cột: Name, Progress, Current Lesson, Assignments, Last Active, Quiz Avg) ── */
export interface ClassroomStudentItem {
    id: string | number;
    studentName: string;
    progress: string;
    currentLesson: string;
    assignments: string;
    lastActive: string;
    quizAvg: string;
    isHighlight?: boolean;
}

/* ── Sample Student Submissions Data (5 cột) ── */
export const DEFAULT_STUDENT_SUBMISSIONS: StudentSubmissionItem[] = [
    { id: '1', studentName: 'Shakia Afumba', submittedAt: 'Aug 25, 2026', score: '95/100', attempts: 1, status: 'Passed' },
    { id: '2', studentName: 'Thomas Diaz', submittedAt: 'Aug 25, 2026', score: '95/100', attempts: 3, status: 'Unfinished' },
    { id: '3', studentName: 'Felipe Castro', submittedAt: 'Aug 25, 2026', score: '95/100', attempts: 1, status: 'Passed' },
    { id: '4', studentName: 'Carlos Álvarez', submittedAt: 'Aug 25, 2026', score: '95/100', attempts: 2, status: 'Unfinished' },
    { id: '5', studentName: 'Fatima Ababio', submittedAt: 'Aug 25, 2026', score: '95/100', attempts: 2, status: 'Passed' },
    { id: '6', studentName: 'Nicole Williams', submittedAt: 'Aug 25, 2026', score: '95/100', attempts: 3, status: 'Passed' },
    { id: '7', studentName: 'Stephen Williams', submittedAt: 'Aug 25, 2026', score: '95/100', attempts: 1, status: 'Passed' },
    { id: '8', studentName: 'Ishita Singh', submittedAt: 'Aug 25, 2026', score: '95/100', attempts: 1, status: 'Passed' },
];

/* ── Sample Classroom Students Data (6 cột như hình mẫu trong management/students) ── */
export const DEFAULT_CLASSROOM_STUDENTS: ClassroomStudentItem[] = [
    {
        id: '1',
        studentName: 'Zendaya Abdallah',
        progress: '89%',
        currentLesson: 'M02_LS03',
        assignments: '3/4',
        lastActive: 'Today',
        quizAvg: '89%',
        isHighlight: false,
    },
    {
        id: '2',
        studentName: 'Prasetyo Makuta Dabukke',
        progress: '89%',
        currentLesson: 'M02_LS03',
        assignments: '3/4',
        lastActive: '3days ago',
        quizAvg: '89%',
        isHighlight: false,
    },
    {
        id: '3',
        studentName: 'Maryam Khan',
        progress: '89%',
        currentLesson: 'M02_LS03',
        assignments: '3/4',
        lastActive: 'Today',
        quizAvg: '89%',
        isHighlight: false,
    },
    {
        id: '4',
        studentName: 'Jay Devi',
        progress: '100%',
        currentLesson: 'M02_LS03',
        assignments: '4/4',
        lastActive: 'Today',
        quizAvg: 'Passed',
        isHighlight: true,
    },
    {
        id: '5',
        studentName: 'Nicholas Hernandez',
        progress: '89%',
        currentLesson: 'M02_LS03',
        assignments: '3/4',
        lastActive: 'Today',
        quizAvg: '89%',
        isHighlight: false,
    },
    {
        id: '6',
        studentName: 'Aditya Das',
        progress: '89%',
        currentLesson: 'M02_LS03',
        assignments: '3/4',
        lastActive: 'Today',
        quizAvg: '89%',
        isHighlight: false,
    },
    {
        id: '7',
        studentName: 'Ishita Kumar',
        progress: '100%',
        currentLesson: 'M02_LS03',
        assignments: '4/4',
        lastActive: 'Today',
        quizAvg: 'Passed',
        isHighlight: true,
    },
    {
        id: '8',
        studentName: 'Parteek Lumari',
        progress: '89%',
        currentLesson: 'M02_LS03',
        assignments: '3/4',
        lastActive: 'Today',
        quizAvg: '89%',
        isHighlight: false,
    },
    {
        id: '9',
        studentName: 'Anaya Mandal',
        progress: '100%',
        currentLesson: 'M02_LS03',
        assignments: '4/4',
        lastActive: 'Today',
        quizAvg: 'Passed',
        isHighlight: true,
    },
];

/* ── Generic Column Definition ── */
export interface TablePaymentColumn<T = any> {
    key: string;
    title: React.ReactNode;
    width?: string;
    className?: string;
    headerClassName?: string;
    render?: (item: T, index: number) => React.ReactNode;
}

/* ── TablePayment Props ── */
export interface TablePaymentProps<T = any> {
    /** Kiểu hiển thị: 'payment' (hóa đơn) | 'submission' (bài làm học viên 5 cột) | 'students' (tiến độ học viên 6 cột) | 'custom' */
    variant?: 'payment' | 'submission' | 'students' | 'classroom-students' | 'custom';
    /** Dữ liệu bài làm học viên (khi dùng variant="submission") */
    studentSubmissions?: StudentSubmissionItem[];
    /** Dữ liệu danh sách học viên (khi dùng variant="students") */
    classroomStudents?: ClassroomStudentItem[];
    /** Dữ liệu hóa đơn (khi dùng variant="payment") */
    invoices?: InvoiceItem[];
    /** Mảng dữ liệu chung (tương thích mọi kiểu) */
    data?: T[];
    /** Cấu hình các cột tùy biến */
    columns?: TablePaymentColumn<T>[];
    /** Callback khi click nút xem chi tiết hóa đơn */
    onSelectInvoice?: (invoice: any) => void;
    onViewDetail?: (invoice: any) => void;
    /** Callback khi click vào 1 dòng học viên */
    onSelectStudent?: (student: any) => void;
    /** Tiêu đề tùy chỉnh cho từng cột */
    colIdTitle?: React.ReactNode;
    colPurchaseTitle?: React.ReactNode;
    colDateTitle?: React.ReactNode;
    colPaymentTitle?: React.ReactNode;
    colTotalTitle?: React.ReactNode;
    col1Title?: React.ReactNode;
    col2Title?: React.ReactNode;
    col3Title?: React.ReactNode;
    col4Title?: React.ReactNode;
    col5Title?: React.ReactNode;
    col6Title?: React.ReactNode;
    /** Tự động làm nổi bật dòng lớp đào tạo (training class) */
    showHighlightTraining?: boolean;
    /** Hiển thị nút biểu tượng con mắt xem chi tiết */
    showActionEye?: boolean;
    /** Biểu tượng tùy chỉnh cho nút xem chi tiết */
    eyeIcon?: React.ReactNode;
    /** Tùy biến render action cell ở cột cuối cùng */
    renderAction?: (item: T) => React.ReactNode;
    /** Thông báo khi không có dữ liệu */
    emptyMessage?: React.ReactNode;
    /** ClassName tùy chỉnh cho wrapper */
    className?: string;
    /** Inline style tùy chỉnh */
    style?: React.CSSProperties;
}

export default function TablePayment<T = any>({
    variant = 'payment',
    studentSubmissions,
    classroomStudents,
    invoices,
    data,
    columns,
    onSelectInvoice,
    onViewDetail,
    onSelectStudent,
    colIdTitle,
    colPurchaseTitle,
    colDateTitle,
    colPaymentTitle,
    colTotalTitle,
    col1Title,
    col2Title,
    col3Title,
    col4Title,
    col5Title,
    col6Title,
    showHighlightTraining = true,
    showActionEye = true,
    eyeIcon,
    renderAction,
    emptyMessage,
    className = '',
    style,
}: TablePaymentProps<T>) {
    // Determine active variant
    const isStudentsMode = variant === 'students' || variant === 'classroom-students' || Boolean(classroomStudents);
    const isSubmissionMode = variant === 'submission' || Boolean(studentSubmissions);
    const handleSelectInvoice = onSelectInvoice || onViewDetail;

    // ── 1. Custom Columns Mode ──
    if (columns && columns.length > 0) {
        const customList = data || [];
        return (
            <div className={`${styles['payment-history__table-wrapper']} ${className}`.trim()} style={style}>
                <table className={styles['payment-history__table']}>
                    <thead className={styles['payment-history__thead']}>
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    style={col.width ? { width: col.width } : undefined}
                                    className={`${styles['payment-history__th']} ${col.headerClassName || ''}`}
                                >
                                    {col.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={styles['payment-history__tbody']}>
                        {customList.length > 0 ? (
                            customList.map((item: any, idx: number) => (
                                <tr key={item.id || idx} className={styles['payment-history__tr']}>
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={`${styles['payment-history__td']} ${col.className || ''}`}
                                        >
                                            {col.render ? col.render(item, idx) : item[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className={styles['payment-history__empty']}>
                                    {emptyMessage || 'No records found.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }

    // ── 2. Classroom Students 6-Column Mode (NAME STUDENT, PROGRESS, CURRENT LESSON, ASSIGNMENTS, LAST ACTIVE, QUIZ AVG.) ──
    if (isStudentsMode) {
        const list: ClassroomStudentItem[] =
            classroomStudents || (data as unknown as ClassroomStudentItem[]) || DEFAULT_CLASSROOM_STUDENTS;

        const th1 = col1Title || 'NAME STUDENT';
        const th2 = col2Title || 'PROGRESS';
        const th3 = col3Title || 'CURRENT LESSON';
        const th4 = col4Title || 'ASSIGNMENTS';
        const th5 = col5Title || 'LAST ACTIVE';
        const th6 = col6Title || 'QUIZ AVG.';

        return (
            <div className={`${styles['payment-history__table-wrapper']} ${className}`.trim()} style={style}>
                <table className={styles['payment-history__table']}>
                    <thead className={styles['payment-history__thead']}>
                        <tr>
                            <th className={`${styles['payment-history__th']} ${styles['payment-history__col-id']}`} style={{ width: '20%' }}>
                                {th1}
                            </th>
                            <th className={`${styles['payment-history__th']}`} style={{ width: '15%' }}>
                                {th2}
                            </th>
                            <th className={`${styles['payment-history__th']} ${styles['payment-history__col-purchase']}`} style={{ width: '18%' }}>
                                {th3}
                            </th>
                            <th className={`${styles['payment-history__th']}`} style={{ width: '15%' }}>
                                {th4}
                            </th>
                            <th className={`${styles['payment-history__th']} ${styles['payment-history__col-date']}`} style={{ width: '16%' }}>
                                {th5}
                            </th>
                            <th className={`${styles['payment-history__th']} ${styles['payment-history__col-total']}`} style={{ width: '16%' }}>
                                {th6}
                            </th>
                        </tr>
                    </thead>
                    <tbody className={styles['payment-history__tbody']}>
                        {list.length > 0 ? (
                            list.map((st) => {
                                const isPassed =
                                    typeof st.quizAvg === 'string' && st.quizAvg.trim().toLowerCase() === 'passed';
                                const isRowHighlight =
                                    st.isHighlight ?? (isPassed || st.progress === '100%');

                                return (
                                    <tr
                                        key={st.id}
                                        className={`${styles['payment-history__tr']} ${
                                            isRowHighlight ? styles['payment-history__tr--highlight'] : ''
                                        }`}
                                        onClick={() => onSelectStudent && onSelectStudent(st)}
                                        style={onSelectStudent ? { cursor: 'pointer' } : undefined}
                                    >
                                        {/* 1. Student Name */}
                                        <td className={`${styles['payment-history__td']} ${styles['payment-history__td--id']}`}>
                                            {st.studentName}
                                        </td>

                                        {/* 2. Progress */}
                                        <td className={styles['payment-history__td']}>
                                            {st.progress}
                                        </td>

                                        {/* 3. Current Lesson */}
                                        <td className={`${styles['payment-history__td']} ${styles['payment-history__td--purchase']}`}>
                                            {st.currentLesson}
                                        </td>

                                        {/* 4. Assignments */}
                                        <td className={styles['payment-history__td']}>
                                            {st.assignments}
                                        </td>

                                        {/* 5. Last Active */}
                                        <td className={`${styles['payment-history__td']} ${styles['payment-history__td--date']}`}>
                                            {st.lastActive}
                                        </td>

                                        {/* 6. Quiz Avg */}
                                        <td className={styles['payment-history__td']}>
                                            <span
                                                className={
                                                    isPassed
                                                        ? styles['payment-history__status-passed']
                                                        : undefined
                                                }
                                            >
                                                {st.quizAvg}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className={styles['payment-history__empty']}>
                                    {emptyMessage || 'No student records found.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }

    // ── 3. Student Submissions 5-Column Mode (NAME STUDENT, SUBMITTED AT, SCORE, ATTEMPTS, STATUS) ──
    if (isSubmissionMode) {
        const studentList: StudentSubmissionItem[] =
            studentSubmissions || (data as unknown as StudentSubmissionItem[]) || DEFAULT_STUDENT_SUBMISSIONS;

        const th1 = col1Title || colIdTitle || 'NAME STUDENT';
        const th2 = col2Title || colPurchaseTitle || 'SUBMITTED AT';
        const th3 = col3Title || colDateTitle || 'SCORE';
        const th4 = col4Title || colPaymentTitle || 'ATTEMPTS';
        const th5 = col5Title || colTotalTitle || 'STATUS';

        return (
            <div className={`${styles['payment-history__table-wrapper']} ${className}`.trim()} style={style}>
                <table className={styles['payment-history__table']}>
                    <thead className={styles['payment-history__thead']}>
                        <tr>
                            <th className={`${styles['payment-history__th']} ${styles['payment-history__col-id']}`} style={{ width: '22%' }}>
                                {th1}
                            </th>
                            <th className={`${styles['payment-history__th']} ${styles['payment-history__col-purchase']}`} style={{ width: '22%' }}>
                                {th2}
                            </th>
                            <th className={`${styles['payment-history__th']} ${styles['payment-history__col-date']}`} style={{ width: '18%' }}>
                                {th3}
                            </th>
                            <th className={`${styles['payment-history__th']} ${styles['payment-history__col-payment']}`} style={{ width: '18%' }}>
                                {th4}
                            </th>
                            <th className={`${styles['payment-history__th']} ${styles['payment-history__col-total']}`} style={{ width: '20%' }}>
                                {th5}
                            </th>
                        </tr>
                    </thead>
                    <tbody className={styles['payment-history__tbody']}>
                        {studentList.length > 0 ? (
                            studentList.map((st) => {
                                const isPassed =
                                    typeof st.status === 'string' && st.status.trim().toLowerCase() === 'passed';

                                return (
                                    <tr
                                        key={st.id}
                                        className={styles['payment-history__tr']}
                                        onClick={() => onSelectStudent && onSelectStudent(st)}
                                        style={onSelectStudent ? { cursor: 'pointer' } : undefined}
                                    >
                                        {/* 1. Student Name */}
                                        <td className={`${styles['payment-history__td']} ${styles['payment-history__td--id']}`}>
                                            {st.studentName}
                                        </td>

                                        {/* 2. Submitted At Date */}
                                        <td className={`${styles['payment-history__td']} ${styles['payment-history__td--date']}`}>
                                            {st.submittedAt}
                                        </td>

                                        {/* 3. Score */}
                                        <td className={`${styles['payment-history__td']} ${styles['payment-history__td--purchase']}`}>
                                            {st.score}
                                        </td>

                                        {/* 4. Attempts */}
                                        <td className={`${styles['payment-history__td']} ${styles['payment-history__td--payment']}`}>
                                            {st.attempts}
                                        </td>

                                        {/* 5. Status */}
                                        <td className={styles['payment-history__td']}>
                                            <span
                                                className={
                                                    isPassed
                                                        ? styles['payment-history__status-passed']
                                                        : styles['payment-history__status-unfinished']
                                                }
                                            >
                                                {st.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={5} className={styles['payment-history__empty']}>
                                    {emptyMessage || 'No student submissions found.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }

    // ── 4. Default Invoices Payment Table ──
    const invoiceList: InvoiceItem[] =
        invoices || (data as unknown as InvoiceItem[]) || [];

    const th1 = col1Title || colIdTitle || 'ORDER ID CODE';
    const th2 = col2Title || colPurchaseTitle || 'PURCHASE';
    const th3 = col3Title || colDateTitle || 'DATE';
    const th4 = col4Title || colPaymentTitle || 'PAYMENT';
    const th5 = col5Title || colTotalTitle || 'TOTAL';

    return (
        <div className={`${styles['payment-history__table-wrapper']} ${className}`.trim()} style={style}>
            <table className={styles['payment-history__table']}>
                {/* Table Header */}
                <thead className={styles['payment-history__thead']}>
                    <tr>
                        <th className={`${styles['payment-history__th']} ${styles['payment-history__col-id']}`}>
                            {th1}
                        </th>
                        <th className={`${styles['payment-history__th']} ${styles['payment-history__col-purchase']}`}>
                            {th2}
                        </th>
                        <th className={`${styles['payment-history__th']} ${styles['payment-history__col-date']}`}>
                            {th3}
                        </th>
                        <th className={`${styles['payment-history__th']} ${styles['payment-history__col-payment']}`}>
                            {th4}
                        </th>
                        <th className={`${styles['payment-history__th']} ${styles['payment-history__col-total']}`}>
                            {th5}
                        </th>
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody className={styles['payment-history__tbody']}>
                    {invoiceList.length > 0 ? (
                        invoiceList.map((inv) => {
                            const isTrainingHighlight =
                                showHighlightTraining &&
                                (inv.isHighlight ||
                                    inv.purchase.toLowerCase().includes('traning class') ||
                                    inv.purchase.toLowerCase().includes('training class'));

                            return (
                                <tr
                                    key={inv.id}
                                    className={`${styles['payment-history__tr']} ${
                                        isTrainingHighlight ? styles['payment-history__tr--highlight'] : ''
                                    }`}
                                >
                                    {/* Column 1: Order ID */}
                                    <td className={`${styles['payment-history__td']} ${styles['payment-history__td--id']}`}>
                                        {inv.orderId}
                                    </td>

                                    {/* Column 2: Purchase */}
                                    <td
                                        className={`${styles['payment-history__td']} ${
                                            isTrainingHighlight
                                                ? styles['payment-history__td--highlight-purchase']
                                                : styles['payment-history__td--purchase']
                                        }`}
                                    >
                                        {inv.purchase}
                                    </td>

                                    {/* Column 3: Date */}
                                    <td className={`${styles['payment-history__td']} ${styles['payment-history__td--date']}`}>
                                        {inv.date}
                                    </td>

                                    {/* Column 4: Payment Method */}
                                    <td
                                        className={`${styles['payment-history__td']} ${styles['payment-history__td--payment']} ${
                                            inv.payment.length > 15 ? styles['payment-history__td--payment-long'] : ''
                                        }`}
                                    >
                                        {inv.payment}
                                    </td>

                                    {/* Column 5: Total & Action Eye Icon */}
                                    <td className={styles['payment-history__td']}>
                                        <div className={styles['payment-history__total-cell']}>
                                            <span className={styles['payment-history__total-price']}>
                                                {inv.total}
                                            </span>

                                            {renderAction ? (
                                                renderAction(inv as unknown as T)
                                            ) : showActionEye && handleSelectInvoice ? (
                                                <button
                                                    type="button"
                                                    className={styles['payment-history__eye-btn']}
                                                    onClick={() => handleSelectInvoice(inv)}
                                                    title="View Invoice Detail"
                                                    aria-label={`View invoice ${inv.orderId}`}
                                                >
                                                    {eyeIcon || <DefaultEyeIcon />}
                                                </button>
                                            ) : null}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={5} className={styles['payment-history__empty']}>
                                {emptyMessage || 'No invoices found matching your criteria.'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
