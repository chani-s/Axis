// Header.tsx
import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';
import ProfilePopup from './ProfilePopup/ProfilePopup';
import { userDetailsStore } from '../../../services/zustand';


const Header = () => {
    //userName: string, profilePicture: string, userEmail: string (should be in props)
    const userDetails = userDetailsStore((state) => state.userDetails); // שליפת הנתונים מ-zustand
    const [userName, setUserName] = useState("חנה");
    const [userEmail, setUserEmail] = useState('abcdefg@gmail.com');
    const [profilePicture, setProfilePicture] = useState('https://www.mamanet.org.il/MamanetPlayersPictures/Screen-Shot-2022-06-15-at-13.38.00-274x300.png');
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    console.log("userDetails:", userDetails);

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
                title={userDetails._id + "\n" + userDetails.email}>
                <img
                    className={styles.profilePicture}
                    src={profilePicture}
                    alt="profile"
                    onClick={showPersonalProfile}>
                </img>
                <p>{userName}</p>
            </div>
            <img className={styles.logo} src="/imgs/nonebg1.png" alt="logo"></img>

            {isPopupOpen && (
                <ProfilePopup
                    userName={userDetails._id}
                    userEmail={userDetails.email}
                    profilePicture={profilePicture}
                    onClose={closePopup}
                    onSave={saveProfile}
                />
            )}
        </div>
    )

}
export default Header;
