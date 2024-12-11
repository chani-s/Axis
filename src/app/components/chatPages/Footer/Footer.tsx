import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.logo}>
          <img src="/imgs/whitelogo.png" alt="logo" />
        </div>
        <div className={styles.developers}>
          <a className={styles.policyLink}>אפיון ופיתוח</a>:
          <a href="https://github.com/AyalaSprei" className={styles.policyLink}>אילה</a>
          <a href="https://github.com/rut-te" className={styles.policyLink}>רותי</a>
          <a href="https://github.com/chani-s" className={styles.policyLink}>חני</a>
        </div>
        <div className={styles.policy}>
          <a href="/about" className={styles.policyLink}>מדיניות פרטיות</a> | 
          <a href="/about" className={styles.policyLink}>תנאי שימוש</a>
        </div>
        <div className={styles.socialIcons}>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook className={styles.icon} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter className={styles.icon} />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className={styles.icon} />
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className={styles.icon} />
          </a>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
