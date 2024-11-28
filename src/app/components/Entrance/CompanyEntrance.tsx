"use client";
import React, { useState } from "react";
import Link from "next/link";
import style from "./CompanyEntrance.module.css";
import { FaArrowUp } from "react-icons/fa";

export const CompanyEntrance = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [officialBusinessName, setOfficialBusinessName] = useState("");
    const [businessDisplayName, setBusinessDisplayName] = useState("");
    const [businessCode, setBusinessCode] = useState("");

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log(email, password, officialBusinessName,
            businessDisplayName, businessCode);

        // Send data to server
    }

    return (

        <form onSubmit={handleSubmit} className={style.container}>
            <h2 className={style.title}>חברה חדשה</h2>
            <div className={style.inputs_container}>
                < div className={style.files_container}>
                    <h4 className={style.secondary_title}>העלה מסמכי בעלות חברה</h4>
                    <h6 className={style.secondary_title}>עד 3 מסמכים</h6>
                    <button className={style.uploadButton} ><FaArrowUp /> העלאת מסמכים  </button>
                </div>
                < div className={style.text_container}>
                    <input type="email" placeholder="אימייל" className={style.input}
                        onChange={(e) => setEmail(e.target.value)}
                        title="אנא הכנס כתובת אימייל תקינה" required pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" />
                    <input type="password" placeholder="סיסמא" className={style.input}
                        onChange={(e) => setPassword(e.target.value)}
                        title=" הסיסמה חייבת לכלול אותיות קטנות וגדולות ומספרים, באורך לפחות 6 תווים" required pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$" />
                    <input type="text" placeholder="שם עסק רשמי" className={style.input}
                        onChange={(e) => setOfficialBusinessName(e.target.value)}
                        required />
                    <input type="text" placeholder="קוד עסק" className={style.input}
                        onChange={(e) => setBusinessCode(e.target.value)}
                        required />
                    <input type="text" placeholder="שם עסק לתצוגה" className={style.input}
                        onChange={(e) => setBusinessDisplayName(e.target.value)}
                        required />
                </div>
            </div>
            < button className={style.submitButton} type="submit" > הרשם </button>
            < Link href="/login" className={style.link} >? חברה / משתמש רשום </Link>
            < Link href="/signup" className={style.link} >?משתמש חדש</Link>
        </form>

    );
};
