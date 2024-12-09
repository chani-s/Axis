import React from "react";
import styles from "./LandingPage.module.css";
import Link from "next/link";

const LandingPage = () => {
    return (
        <div className={styles.container}>
            <img src="/imgs/nonebg1.png" alt="Logo" className={styles.logo} />
            <h1 className={styles.title}>בוא נעשה סדר בפניות השירות שלך</h1>
            <div className={styles.buttons}>
                <Link className={styles.navLink} href="/signup">הרשמה</Link>
                <Link className={styles.navLink} href="/login">כניסה</Link>
            </div>
        </div>
    );
};

export default LandingPage;
