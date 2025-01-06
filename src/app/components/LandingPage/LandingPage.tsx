import React from "react";
import styles from "./LandingPage.module.css";
import Link from "next/link";

const LandingPage = () => {
    const companies = [
        { name: "צה\"ל", service: "שירות צבאי", logo: "https://hadshon.edu.gov.il/wp-content/uploads/2021/01/330px-Badge_of_the_Israel_Defense_Forces.svg_.png" },
        { name: "דיסקונט", service: "שירותים בנקאיים", logo: "https://heter-iska.com/wp-content/uploads/2023/03/images.jpg" },
        { name: "עיריית ירושלים", service: "שירותים עירוניים", logo: "https://www.prolink.co.il/wp-content/webp-express/webp-images/uploads/2019/01/10_20160914_1033338332-1.jpg.webp" },
        { name: "WOW", service: "אינטרנט ותקשורת", logo: "https://www.icoupons.co.il/wp-content/uploads/2023/05/wow-480x480.jpg" },
        { name: "מאוחדת", service: "שירותי בריאות", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcOUG4ZwNfnN9UnTPwubp3GXfGkU76UQ4tmw&s" }
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <img src="/imgs/whitelogo.png" alt="Logo" className={styles.logo} />
                <h1 className={styles.title}>עושים סדר בפניות השירות שלך</h1>
                <p className={styles.description}>כל הפניות שלך במקום אחד, עם השירותים המובילים בישראל.</p>
                <div className={styles.buttons}>
                    <Link className={styles.navLink} href="/signup">הרשמה</Link>
                    <Link className={styles.navLink} href="/login">כניסה</Link>
                </div>
            </header>

            <section className={styles.companiesSection}>
                <h2 className={styles.companiesTitle}>חברות מובילות שכבר משתמשות במערכת:</h2>
                <div className={styles.companiesGrid}>
                    {companies.map((company, index) => (
                        <div key={index} className={styles.companyCard}>
                            <div className={styles.flipCard}>
                                <div className={styles.flipCardInner}>
                                    <div className={styles.flipCardFront}>
                                        <img src={company.logo} alt={company.name} className={styles.companyLogo} />
                                    </div>
                                    <div className={styles.flipCardBack}>
                                        <h3 className={styles.companyName}>{company.name}</h3>
                                        <p className={styles.companyService}>{company.service}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
