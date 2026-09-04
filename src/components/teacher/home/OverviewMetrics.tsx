import styles from '@/styles/teacher/home/OverviewMetrics.module.css';

interface MetricItem {
    id: string | number;
    number: string | number;
    title: string;
    icon: React.ReactNode;
}

const DEFAULT_METRICS: MetricItem[] = [
    {
        id: 'online-class',
        number: '15',
        title: 'Total Online class',
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M27 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V25C3 25.5304 3.21071 26.0391 3.58579 26.4142C3.96086 26.7893 4.46957 27 5 27H6.67375C6.86301 27.0001 7.0484 26.9464 7.20838 26.8453C7.36836 26.7442 7.49636 26.5997 7.5775 26.4287C8.06377 25.4021 8.83151 24.5346 9.79143 23.9271C10.7514 23.3196 11.864 22.9971 13 22.9971C14.136 22.9971 15.2486 23.3196 16.2086 23.9271C17.1685 24.5346 17.9362 25.4021 18.4225 26.4287C18.5036 26.5997 18.6316 26.7442 18.7916 26.8453C18.9516 26.9464 19.137 27.0001 19.3263 27H27C27.5304 27 28.0391 26.7893 28.4142 26.4142C28.7893 26.0391 29 25.5304 29 25V7C29 6.46957 28.7893 5.96086 28.4142 5.58579C28.0391 5.21071 27.5304 5 27 5ZM13 21C12.2089 21 11.4355 20.7654 10.7777 20.3259C10.1199 19.8864 9.60723 19.2616 9.30448 18.5307C9.00173 17.7998 8.92252 16.9956 9.07686 16.2196C9.2312 15.4437 9.61216 14.731 10.1716 14.1716C10.731 13.6122 11.4437 13.2312 12.2196 13.0769C12.9956 12.9225 13.7998 13.0017 14.5307 13.3045C15.2616 13.6072 15.8864 14.1199 16.3259 14.7777C16.7654 15.4355 17 16.2089 17 17C17 18.0609 16.5786 19.0783 15.8284 19.8284C15.0783 20.5786 14.0609 21 13 21ZM27 25H19.9287C19.4928 24.2483 18.9372 23.5728 18.2838 23H24C24.2652 23 24.5196 22.8946 24.7071 22.7071C24.8946 22.5196 25 22.2652 25 22V10C25 9.73478 24.8946 9.48043 24.7071 9.29289C24.5196 9.10536 24.2652 9 24 9H8C7.73478 9 7.48043 9.10536 7.29289 9.29289C7.10536 9.48043 7 9.73478 7 10V22C6.99989 22.2218 7.07351 22.4373 7.20928 22.6127C7.34505 22.788 7.53526 22.9133 7.75 22.9688C7.08152 23.5479 6.51417 24.2344 6.07125 25H5V7H27V25Z" fill="white" />
            </svg>
        ),
    },
    {
        id: 'onsite-class',
        number: '5',
        title: 'Total On-site class',
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 7C4.89543 7 4 7.89543 4 9V20C4 21.1046 4.89543 22 6 22H26C27.1046 22 28 21.1046 28 20V9C28 7.89543 27.1046 7 26 7H6ZM6 9.5C6 9.22386 6.22386 9 6.5 9H25.5C25.7761 9 26 9.22386 26 9.5V19.5C26 19.7761 25.7761 20 25.5 20H6.5C6.22386 20 6 19.7761 6 19.5V9.5ZM3 23C2.44772 23 2 23.4477 2 24C2 24.5523 2.44772 25 3 25H29C29.5523 25 30 24.5523 30 24C30 23.4477 29.5523 23 29 23H3Z" fill="white" />
            </svg>
        ),
    },
    {
        id: 'students',
        number: '235',
        title: 'Total Students',
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 14C14.2091 14 16 12.2091 16 10C16 7.79086 14.2091 6 12 6C9.79086 6 8 7.79086 8 10C8 12.2091 9.79086 14 12 14ZM21 15C22.6569 15 24 13.6569 24 12C24 10.3431 22.6569 9 21 9C19.3431 9 18 10.3431 18 12C18 13.6569 19.3431 15 21 15ZM12 17C8.68629 17 4 18.67 4 22V24C4 24.5523 4.44772 25 5 25H19C19.5523 25 20 24.5523 20 24V22C20 18.67 15.3137 17 12 17ZM21 18C20.66 18 20.29 18.02 19.91 18.06C21.19 19.14 22 20.48 22 22V24C22 24.36 21.94 24.7 21.84 25H27C27.5523 25 28 24.5523 28 24V22C28 19.33 23.97 18 21 18Z" fill="white" />
            </svg>
        ),
    },
    {
        id: 'graduated-students',
        number: '235',
        title: 'Total Graduated Students',
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 6L3 13L16 20L27 14.0769V22H29V13L16 6ZM8 17.7692V23.5C8 25.5 11.5817 27 16 27C20.4183 27 24 25.5 24 23.5V17.7692L16 22.0769L8 17.7692Z" fill="white" />
            </svg>
        ),
    },
];

interface OverviewMetricsProps {
    metrics?: MetricItem[];
}

export default function OverviewMetrics({ metrics = DEFAULT_METRICS }: OverviewMetricsProps) {
    return (
        <section className={styles.overviewMetrics}>
            <div className={styles.overviewMetricsContainer}>
                <div className={styles.overviewMetricsGrid}>
                    {metrics.map((item) => (
                        <article key={item.id} className={styles.overviewMetricsItem}>
                            <div className={styles.overviewMetricsItemIcon}>
                                {item.icon}
                            </div>
                            <p className={styles.overviewMetricsItemNumber}>{item.number}</p>
                            <h3 className={styles.overviewMetricsItemTitle}>{item.title}</h3>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}