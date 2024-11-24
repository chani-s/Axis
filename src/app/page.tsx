import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.spinner}></div>
      <div className={styles.text}>coming soon</div>
    </div>
  );
}
