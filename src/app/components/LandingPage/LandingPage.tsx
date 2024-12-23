import React from "react";
import styles from "./LandingPage.module.css";
import Link from "next/link";

const LandingPage = () => {
    return (
        <div>
            <div className={styles.container}>
                <img src="/imgs/nonebg1.png" alt="Logo" className={styles.logo} />
                <h1 className={styles.title}>עושים סדר בפניות השירות שלך</h1>
                <h2 className={styles.p}> כי מגיע לך מענה חד ומהיר, והכל במקום אחד!</h2>
                <div className={styles.buttons}>
                    <Link className={styles.navLink} href="/signup">הרשמה</Link>
                    <Link className={styles.navLink} href="/login">כניסה</Link>
                </div>
            </div>

        </div >
    );
};

export default LandingPage;
