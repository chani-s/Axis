// ProfilePopup.tsx
import React, { useRef, useState } from "react";
import styles from './ProfilePopup.module.css';
import { FaArrowUp, FaCamera, FaTimes } from 'react-icons/fa';


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
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    setNewProfilePic(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };


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
                    <img
                        className={styles.profilePicture}
                        src={newProfilePic}
                        alt="profilePic"
                    />
                    <FaCamera className={styles.cameraIcon} onClick={handleButtonClick} />
                    </div>
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

                <input
                    type="file"
                    id="file-upload"
                    ref={fileInputRef}
                    accept=".png"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
                <button type="submit" className={styles.saveButton}>שמור</button>
            </form>
        </div>
    );
};

export default ProfilePopup;
