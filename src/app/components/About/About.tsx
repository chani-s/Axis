import styles from "./About.module.css";

export default function About() {
    return (
        <div className={styles.aboutPage}>
            <img src="/imgs/nonebg1.png" alt="logo" className={styles.logo} />
            <h1 className={styles.intro}>
                ברוכים הבאים ל- Axis
            </h1>
            <h2> הציר שמחבר בין אנשים ועסקים בדרך פשוטה, מהירה ויעילה.</h2>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>החזון שלנו</h2>
                <p>
                    להפוך את חוויית השירות ליעילה ונגישה, תוך שקיפות מלאה ושיפור שביעות הרצון של הלקוחות.
                </p>
            </div>
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>מה האפליקציה עושה?</h2>
                <p>
                    אנו מציעים פלטפורמה חכמה לניהול פניות שירות, המאפשרת מעקב בזמן אמת, חיבור פשוט עם נציגים ושיפור תהליכי שירות.
                </p>
            </div>
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>למה לבחור בנו?</h2>
                <ul>
                    <li>כל שירותי הלקוחות במקום אחד.</li>
                    <li>מעקב שקוף אחר סטטוס הפניות שלך.</li>
                    <li>ניהול חכם לעסקים לשיפור זמני התגובה.</li>
                </ul>
            </div>
            <div className={styles.callToAction}>
                <p>
                    הצטרפו אלינו למהפכת השירות בישראל! יחד נהפוך את התקשורת בין לקוחות לעסקים לפשוטה ומהירה.
                </p>
            </div>
        </div >
    );
};
