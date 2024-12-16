"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendVerificationCode, resetPassword } from '../../services/user';
import style from "./ForgotPassword.module.css";
import { AiOutlineClose } from 'react-icons/ai';
import {showError,showSuccess} from "../../services/messeges"

const ForgotPassword = ({ setForgetPassword }: any) => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1);
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [sendEmail, setSendEmail] = useState(false);
    const [checkCode, setCheckCode] = useState(false);

    const handleEmailSubmit = async (e: any) => {
        e.preventDefault();
        try {
            setSendEmail(true);
            await sendVerificationCode(email);
            setSendEmail(false);
            setStep(2);
        } catch (error) {
            showError('הייתה שגיאה במשלוח המייל');
            setSendEmail(false);
        }
    };

    const handleResetPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setCheckCode(true);
            await resetPassword(code, newPassword, email);
            setCheckCode(false);
            showSuccess("הסיסמא שונתה בהצלחה");
            setForgetPassword(false);

        } catch (error) {
            showError('הקוד לא תואם או הייתה שגיאה');
            setCheckCode(false);
        }
    };


    return (
        <div className={style.container}>
            <AiOutlineClose onClick={() => setForgetPassword(false)} />
            <h1 className={style.title}>שחזור סיסמא</h1>
            {step === 1 && (
                <div >
                    {sendEmail &&
                        <>
                            <h4 className={style.send_email_title}>קוד אימות נשלח למייל שלך...</h4>
                            <div className={style.loading_dots}>
                                <div className={style.dot}></div>
                                <div className={style.dot}></div>
                                <div className={style.dot}></div>
                            </div>
                        </>}
                    {!sendEmail && <>
                        <input type="email" placeholder="הכנס אימייל" className={style.input}
                            onChange={(e) => setEmail(e.target.value)}
                            title="אנא הכנס כתובת אימייל תקינה" required pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" />

                        <button onClick={handleEmailSubmit} className={style.submitButton}>שלח קוד אימות</button>
                    </>}
                </div>
            )}

            {step === 2 && (
                <div >
                    {checkCode && 
                     <>
                         <h4 className={style.send_email_title}>קוד האימות נשלח לבדיקה</h4>
                         <div className={style.loading_dots}>
                             <div className={style.dot}></div>
                             <div className={style.dot}></div>
                             <div className={style.dot}></div>
                         </div>
                     </>}
                    {!checkCode && <>
                        <h4 className={style.titles}>
                            הכנס קוד אימות
                            </h4>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                className={style.inputs}
                            />
                        
                          <h4 className={style.titles}>  הכנס סיסמא חדשה</h4>
                            <input type="password" placeholder="סיסמא" className={style.inputs}
                            onChange={(e) => setNewPassword(e.target.value)}
                            title=" הסיסמה חייבת לכלול אותיות קטנות וגדולות ומספרים, באורך לפחות 6 תווים"
                            required pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$" />
                        
                        <button className={style.submitButton} onClick={handleResetPasswordSubmit}>שנה סיסמא</button>
                    </>}
                </div>
            )}

        </div>
    );
};

export default ForgotPassword;
