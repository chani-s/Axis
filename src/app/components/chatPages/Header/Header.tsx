// Header.tsx
import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';
import ProfilePopup from './ProfilePopup/ProfilePopup';
import { userDetailsStore } from '../../../services/zustand';

const DEFAULT_PROFILE_PIC = "https://www.mamanet.org.il/MamanetPlayersPictures/Screen-Shot-2022-06-15-at-13.38.00-274x300.png";


const Header = () => {
    const userDetails = userDetailsStore((state) => state.userDetails); 
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const showPersonalProfile = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <div className={styles.header}>
            <div className={styles.basicDetails}
                title={userDetails.name + "\n" + userDetails.email}>
                <img
                    className={styles.profilePicture}
                    src={userDetails.profile_picture || DEFAULT_PROFILE_PIC}
                    alt="profile"
                    onClick={showPersonalProfile}>
                </img>
                <p>{userDetails.name}</p>

            </div>
            <img className={styles.logo} src="/imgs/nonebg1.png" alt="logo"></img>

            {isPopupOpen && (
                <ProfilePopup
                    onClose={closePopup}
                />
            )}
        </div>
    )

}
export default Header;
