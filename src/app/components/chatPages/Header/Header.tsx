// Header.tsx
import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';
import ProfilePopup from './ProfilePopup/ProfilePopup';
import { userDetailsStore } from '../../../services/zustand';


const Header = () => {
    const userDetails = userDetailsStore((state) => state.userDetails); 

    const [userName, setUserName] = useState("ללא שם");
    const [userEmail, setUserEmail] = useState('abc@gmail.com');
    const [profilePicture, setProfilePicture] = useState('https://www.mamanet.org.il/MamanetPlayersPictures/Screen-Shot-2022-06-15-at-13.38.00-274x300.png');
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const showPersonalProfile = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const saveProfile = (newUserName: string, newEmail: string, newProfilePic: string) => {
        setUserName(newUserName);
        setUserEmail(newEmail);
        setProfilePicture(newProfilePic);
    };

    return (
        <div className={styles.header}>
            <div className={styles.basicDetails}
                title={userDetails.name + "\n" + userDetails.email}>
                <img
                    className={styles.profilePicture}
                    src={profilePicture}
                    alt="profile"
                    onClick={showPersonalProfile}>
                </img>
                <p>{userDetails.name}</p>

            </div>
            <img className={styles.logo} src="/imgs/nonebg1.png" alt="logo"></img>

            {isPopupOpen && (
                <ProfilePopup
                    // userName={userDetails.name}
                    // userEmail={userDetails.email}
                    // profilePicture={profilePicture}
                    onClose={closePopup}
                    // onSave={saveProfile}
                />
            )}
        </div>
    )

}
export default Header;
