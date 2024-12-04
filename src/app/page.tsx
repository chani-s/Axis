"use client";
import styles from "./page.module.css";
import Link from 'next/link';


export default function Home() {
  return (
    <div className={styles.container}>
        <Link className={styles.navLink} href="/login">LogIn</Link>
        <Link className={styles.navLink} href="/signup">SignUp</Link>
        <Link className={styles.navLink} href="/chat/user">Main Chat</Link>

      {/* <img src="/imgs/logo0.png" alt="logo" className={styles.logo} />
      <div className={styles.page}>
      <div className={styles.text}>coming soon</div>

          <img className={styles.spinner} src="/imgs/working.png" alt="work"></img>
      </div> */}
    </div>
  );
}


