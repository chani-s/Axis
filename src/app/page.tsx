import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <img src="../../imgs/logo.png" alt="logo"/>
      <div className={styles.spinner}></div>
      <div className={styles.text}>coming soon</div>
    </div>
  );
}


