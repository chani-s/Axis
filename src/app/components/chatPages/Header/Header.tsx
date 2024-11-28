import React, { useState } from 'react';
import styles from './Header.module.css';

const Header = () => {
    //userName: string, profilePicture: string (should be in props)
    const [userName, setUserName] = useState('חנה סלייטר');
    const [profilePicture, setProfilePicture] = useState('https://www.mamanet.org.il/MamanetPlayersPictures/Screen-Shot-2022-06-15-at-13.38.00-274x300.png');
    return (
        <div className={styles.header}>
            <div className={styles.basicDetails}>
                <img className={styles.profilePicture} src={profilePicture} alt="profile"></img>
                <p>{userName}</p>
            </div>
            <img className={styles.logo} src="/imgs/nonebg1.png" alt="logo"></img>

        </div>
    )

}
export default Header;
