import React from "react";
import { z } from "zod";
import { userDetailsStore } from "../../../services/zustand";
import style from "./DetailsPopUp.module.css";
import { updateUserByEmail } from "@/app/services/details";

const DetailsPopUp = ({ onClose }: { onClose: () => void }) => {    
    const { userDetails, setUserDetails, getMissingDetails } = userDetailsStore();
    const [fullName, setFullName] = React.useState(userDetails.name || "");
    const [address, setAddress] = React.useState(userDetails.address || "");
    const [idNumber, setIdNumber] = React.useState(userDetails.id_number || "");
    const missingDetails = getMissingDetails();
    const [errorMessages, setErrorMessages] = React.useState({
        name: "",
        id_number: "",
        address: "",
    });
    console.log(userDetails);
    
    const isValidIsraeliId = (id: string): boolean => {
        if (id.length > 9) return false;
        id = id.padStart(9, '0'); 
        return (
            id
                .split('')
                .map(Number)
                .reduce((sum, digit, i) => {
                    const step = digit * ((i % 2) + 1);
                    return sum + (step > 9 ? step - 9 : step);
                }, 0) % 10 === 0
        );
    };

    const detailsSchema = z.object({
        name: z.string().min(1, "שם מלא הוא שדה חובה."),
        address: z.string().optional(),
        id_number: z
            .string()
            .optional()
            .refine((id) => id === "" || (id && isValidIsraeliId(id)), "תעודת זהות לא תקינה."),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updatedDetails = {
            name: fullName,
            address: address,
            id_number: idNumber,
        };

        try {
            // ולידציה באמצעות Zod
            detailsSchema.parse(updatedDetails);

            const response = await updateUserByEmail(userDetails.email, updatedDetails);

            if (response.data.success) {
                setUserDetails({
                    ...userDetails,
                    name: updatedDetails.name,
                    address: updatedDetails.address,
                    id_number: updatedDetails.id_number,
                });

                alert("הפרטים נשמרו בהצלחה!");
                onClose();
            } else {
                throw new Error("Failed to update user data");
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrorMessages: { name: string, id_number: string, address: string } = {
                    name: "",
                    id_number: "",
                    address: "",
                };

                error.errors.forEach((err) => {
                    if (err.path.includes("name")) {
                        newErrorMessages.name = err.message;
                    }
                    if (err.path.includes("id_number")) {
                        newErrorMessages.id_number = err.message;
                    }
                    if (err.path.includes("address")) {
                        newErrorMessages.address = err.message;
                    }
                });

                setErrorMessages(newErrorMessages);
            } else {
                console.error("שגיאה:", error);
                alert("שגיאה בשמירת הנתונים");
            }
        }
    };

    if (missingDetails.length === 0) return null;

    return (
        <form onSubmit={handleSubmit} className={style.container}>
            <h2 className={style.title}>השלמת פרטים</h2>
            {missingDetails.includes("name") && (
                <div className={style.inputContainer}>
                    <input
                        type="text"
                        placeholder="שם מלא"
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
                        onChange={(e) => {
                            setAddress(e.target.value);
                            setErrorMessages((prev) => ({ ...prev, address: "" })); // נקה שגיאה כשמשתנים
                        }}
                    />
                    {errorMessages.address && <p className={style.error}>{errorMessages.address}</p>}
                </div>
            )}
            <button type="submit" className={style.submitButton}>
                סיימתי
            </button>
            <button type="button" className={style.cancelButton} onClick={onClose}>
                לא עכשיו
            </button>
        </form>
    );
};

export default DetailsPopUp;
