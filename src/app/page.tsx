"use client";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <img src="/imgs/logo0.png" alt="logo" className={styles.logo} />
      <div className={styles.page}>
      <div className={styles.text}>coming soon</div>

          <img className={styles.spinner} src="/imgs/working.png" alt="work"></img>
      </div>
    </div>
  );
}


