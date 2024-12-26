import React, { useState, useEffect } from "react";
import styles from './ProfilePopup.module.css';
import { FaCamera, FaTimes } from 'react-icons/fa';
import { z } from "zod";
import { detailsSchema } from "@/app/services/detailsValidation";
import { userDetailsStore } from "../../../../services/zustand";
import { updateUserByEmail } from "@/app/services/details";
import { uploadPicture } from "@/app/services/uploadPicture";

const ProfilePopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { userDetails, setUserDetails } = userDetailsStore();
    const [fullName, setFullName] = useState(userDetails.name || "");
    const [address, setAddress] = useState(userDetails.address || "");
    const [idNumber, setIdNumber] = useState(userDetails.id_number || "");
    const [newProfilePic, setNewProfilePic] = useState(userDetails.profile_picture);
    const [errorMessages, setErrorMessages] = useState({
        name: "",
        id_number: "",
    });

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
                name: fullName,
                address: address,
                id_number: idNumber,
                profile_picture: newProfilePic,
            };

            const parsedDetails = detailsSchema.parse(updatedDetails);

            const response = await updateUserByEmail(userDetails.email, parsedDetails);

            if (response.data.success) {
                const mergedDetails = {
                    ...userDetails,
                    ...parsedDetails,
                };

                setUserDetails(mergedDetails);
                onClose();
                localStorage.setItem("userDetails", JSON.stringify(mergedDetails));
            } else {
                throw new Error("Failed to update user data");
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrorMessages: { name: string, id_number: string } = {
                    name: "",
                    id_number: "",
                };

                error.errors.forEach((err) => {
                    if (err.path.includes("name")) {
                        newErrorMessages.name = err.message;
                    }
                    if (err.path.includes("id_number")) {
                        newErrorMessages.id_number = err.message;
                    }
                });

                setErrorMessages(newErrorMessages);
            } else {
                console.error("שגיאה:", error);
                alert("שגיאה בשמירת הנתונים");
            }
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSave();
    };

    return (
        <div className={styles.popup}>
            <form className={styles.popupContent} onSubmit={handleSubmit}>
                <button
                    className={styles.closeButton}
                    type="button"
                    onClick={onClose}>
                    <FaTimes
                        className={styles.x} />
                </button>
                <div>
                    <img className={styles.profilePicture}
                        src={newProfilePic}
                        alt="profilePic" />
                    <FaCamera
                        className={styles.cameraIcon}
                        onClick={handleButtonClick} />
                </div>
                <h2>שלום, {userDetails.name}</h2>

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
                        onChange={(e) => {
                            setFullName(e.target.value)
                            setErrorMessages((prev) => ({ ...prev, fullName: "" }));

                        }}
                    />
                    {errorMessages.name && <p className={styles.error}>{errorMessages.name}</p>}

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
                        onChange={(e) => {
                            setIdNumber(e.target.value)
                            setErrorMessages((prev) => ({ ...prev, id_number: "" }));
                        }}
                    />
                    {errorMessages.id_number && <p className={styles.error}>{errorMessages.id_number}</p>}

                </div>
                <button type="submit" className={styles.saveButton}>שמור</button>
            </form>
        </div>
    );
};

export default ProfilePopup;
