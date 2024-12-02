// ProfilePopup.tsx
import React, { useState } from "react";
import styles from './ProfilePopup.module.css';
import { FaTimes } from 'react-icons/fa';


interface ProfilePopupProps {
    userName: string;
    userEmail: string;
    profilePicture: string;
    onClose: () => void;
    onSave: (newUserName: string, newEmail: string, newProfilePic: string) => void;
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({ userName, userEmail, profilePicture, onClose, onSave }) => {
    const [newUserName, setNewUserName] = useState(userName);
    const [newEmail, setNewEmail] = useState(userEmail);
    const [newProfilePic, setNewProfilePic] = useState(profilePicture);

    const handleSave = () => {
        onSave(newUserName, newEmail, newProfilePic);
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSave();
    };

    return (
        <div className={styles.popup}>
            <form className={styles.popupContent} onSubmit={handleSubmit}>
                <button className={styles.closeButton} type="button" onClick={onClose}><FaTimes /></button>
                <h2>ערוך את הפרופיל שלך</h2>
                <div>
                    <label>שם:</label>
                    <input
                        className={styles.input}
                        type="text"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                    />
                </div>
                <div>
                    <label>אימייל:</label>
                    <input
                        className={styles.input}
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>תמונה:</label>
                    <input
                        className={styles.input}
                        type="text"
                        value={newProfilePic}
                        onChange={(e) => setNewProfilePic(e.target.value)}
                    />
                </div>
                <button type="submit" className={styles.saveButton}>שמור</button>
            </form>
        </div>
    );
};

export default ProfilePopup;
