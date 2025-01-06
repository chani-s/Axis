import React from "react";
import { z } from "zod";
import { detailsSchema } from "../../../services/validations";
import { userDetailsStore } from "../../../services/zustand";
import { updateUserByEmail } from "@/app/services/details";
import style from "./DetailsPopUp.module.css";


const DetailsPopUp = ({ onClose }: { onClose: () => void }) => {
    const { userDetails, setUserDetails, getMissingDetails } = userDetailsStore();
    const [fullName, setFullName] = React.useState(userDetails.name || "");
    const [address, setAddress] = React.useState(userDetails.address || "");
    const [idNumber, setIdNumber] = React.useState(userDetails.id_number || "");
    const missingDetails = getMissingDetails();
    const [errorMessages, setErrorMessages] = React.useState({
        name: "",
        id_number: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedDetails = {
                name: fullName,
                address: address,
                id_number: idNumber,
                email: userDetails.email,
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

    const handleCancelClick = () => {
        onClose();
    };

    if (missingDetails.length === 0) return null;

    return (
        <form onSubmit={handleSubmit} className={style.container}>
            <h2 className={style.title}>השלמת פרטים</h2>
            {missingDetails.includes("name") && (
                <div className={style.inputContainer}>
                    <input
                        type="text"
                        placeholder="שם מלא*"
                        title="שדה זה הוא חובה"
                        className={style.input}
                        value={fullName}
                        onChange={(e) => {
                            setFullName(e.target.value);
                            setErrorMessages((prev) => ({ ...prev, name: "" }));
                        }}
                    />
                    {errorMessages.name && <p className={style.error}>{errorMessages.name}</p>}
                </div>
            )}
            {missingDetails.includes("id_number") && (
                <div className={style.inputContainer}>
                    <input
                        type="text"
                        placeholder="תעודת זהות"
                        className={style.input}
                        value={idNumber}
                        onChange={(e) => {
                            setIdNumber(e.target.value);
                            setErrorMessages((prev) => ({ ...prev, id_number: "" }));
                        }}
                    />
                    {errorMessages.id_number && <p className={style.error}>{errorMessages.id_number}</p>}
                </div>
            )}
            {missingDetails.includes("address") && (
                <div className={style.inputContainer}>
                    <input
                        type="text"
                        placeholder="כתובת"
                        className={style.input}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
            )}
            <button type="submit" className={style.submitButton}>
                סיימתי
            </button>
            <button onClick={handleCancelClick} className={missingDetails.includes("name") ? style.cancelButtonInvisible : style.cancelButton}>
                לא עכשיו
            </button>
        </form>
    );
};

export default DetailsPopUp;
