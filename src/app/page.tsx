"use client";
import styles from "./page.module.css";
import Link from 'next/link';


export default function Home() {
  return (
    <div className={styles.container}>
      <img src="/imgs/logo0.png" alt="logo" className={styles.logo} />
      <Link className={styles.navLink} href="/login">כניסה</Link>
      <Link className={styles.navLink} href="/signup">הרשמה</Link>
      <Link className={styles.navLink} href="/chat/user">עמוד צ'אט</Link>
      {/* <div className={styles.page}>
      <div className={styles.text}>coming soon</div>

          <img className={styles.spinner} src="/imgs/working.png" alt="work"></img>
      </div> */}

    </div>
  );
}


