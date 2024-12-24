import React, { useState, useEffect } from "react";
import styles from './ProfilePopup.module.css';
import { FaCamera, FaTimes } from 'react-icons/fa';
import { userDetailsStore } from "../../../../services/zustand";
import { updateUserByEmail } from "@/app/services/details";
import { uploadPicture } from "@/app/services/uploadPicture";

const DEFAULT_PROFILE_PIC = "https://www.mamanet.org.il/MamanetPlayersPictures/Screen-Shot-2022-06-15-at-13.38.00-274x300.png";

const ProfilePopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { userDetails, setUserDetails } = userDetailsStore();
    const [fullName, setFullName] = useState(userDetails.name || "");
    const [address, setAddress] = useState(userDetails.address || "");
    const [idNumber, setIdNumber] = useState(userDetails.id_number || "");
    const [newProfilePic, setNewProfilePic] = useState(userDetails.profile_picture || DEFAULT_PROFILE_PIC);

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log("Selected file:", file);

            try {
                const fileUrl = await uploadPicture(file);
                console.log("HI THERE" + fileUrl);
                setNewProfilePic(fileUrl);

                setUserDetails({
                    ...userDetails,
                    profile_picture: fileUrl,
                });
            } catch (error) {
                alert("שגיאה בהעלאת התמונה");
            }
        }
    };

    const handleSave = async () => {
        try {
            const updatedDetails = {
                name: fullName || userDetails.name,
                address: address,
                id_number: idNumber,
                profile_picture: newProfilePic,
            };

            const response = await updateUserByEmail(userDetails.email, updatedDetails);

            if (response.data.success) {
                const mergedDetails = {
                    ...userDetails,
                    ...updatedDetails, 
                };

                setUserDetails(mergedDetails);
                onClose();
                localStorage.setItem("userDetails", JSON.stringify(mergedDetails));

            } else {
                throw new Error("Failed to update user data");
            }
        } catch (error) {
            console.error("Error updating user details:", error);
            alert("שגיאה בשמירת הנתונים");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSave();
    };

    return (
        <div className={styles.popup}>
            <form className={styles.popupContent} onSubmit={handleSubmit}>
                <button className={styles.closeButton} type="button" onClick={onClose}><FaTimes /></button>
                <h2>שלום {userDetails.name}</h2>
                <div>
                    <img className={styles.profilePicture} src={newProfilePic} alt="profilePic" />
                    <FaCamera className={styles.cameraIcon} onClick={handleButtonClick} />
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept=".png, .jpg, .jpeg, .gif"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
                <div>
                    <label>שם מלא:</label>
                    <input
                        className={styles.input}
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>
                <div>
                    <label>כתובת:</label>
                    <input
                        className={styles.input}
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <div>
                    <label>תעודת זהות:</label>
                    <input
                        className={styles.input}
                        type="text"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                    />
                </div>
                <button type="submit" className={styles.saveButton}>שמור</button>
            </form>
        </div>
    );
};

export default ProfilePopup;
