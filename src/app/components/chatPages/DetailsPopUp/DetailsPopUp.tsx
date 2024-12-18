import React from "react";
import { userDetailsStore } from "../../../services/zustand";
import style from "./DetailsPopUp.module.css";
import { updateUserByEmail } from "@/app/services/details";

const DetailsPopUp = ({ onClose }: { onClose: () => void }) => {
  const { userDetails, setUserDetails, getMissingDetails } = userDetailsStore();
  const [fullName, setFullName] = React.useState(userDetails.user_name || "");
  const [address, setAddress] = React.useState(userDetails.address || "");
  const [idNumber, setIdNumber] = React.useState(userDetails.id_number || "");

  const missingDetails = getMissingDetails(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const updatedDetails = {
      user_name: fullName,
      address: address,
      id_number: idNumber, 
    };
  
    try {
      const response = await updateUserByEmail(userDetails.email, updatedDetails);
  
      if (response.data.success) {
        setUserDetails({
          ...userDetails,
          user_name: updatedDetails.user_name,
          address: updatedDetails.address,
          id_number: updatedDetails.id_number,
        });
  
        alert("הפרטים נשמרו בהצלחה!");
        onClose();
      } else {
        throw new Error("Failed to update user data");
      }
    } catch (error) {
      console.error("שגיאה:", error);
      alert("שגיאה בשמירת הנתונים");
    }
  };

  if (missingDetails.length === 0) return null;

  return (
    <form onSubmit={handleSubmit} className={style.container}>
      <h2 className={style.title}>השלמת פרטים</h2>
      {missingDetails.includes("user_name") && (
        <div className={style.inputContainer}>
          <input
            type="text"
            placeholder="שם מלא"
            className={style.input}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
      )}
      {missingDetails.includes("id_number") && (
        <div className={style.inputContainer}>
          <input
            type="text"
            placeholder="תעודת זהות"
            className={style.input}
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
          />
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
      <button type="button" className={style.cancelButton} onClick={onClose}>
        לא עכשיו
      </button>
    </form>
  );
};

export default DetailsPopUp;
