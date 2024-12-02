"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import style from "./CompanyEntrance.module.css";
import { FaArrowUp, FaTrash } from "react-icons/fa";

export const CompanyEntrance = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [officialBusinessName, setOfficialBusinessName] = useState("");
    const [businessDisplayName, setBusinessDisplayName] = useState("");
    const [businessCode, setBusinessCode] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const maxFiles = 3; 
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>(
        {}
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(email, password, officialBusinessName, businessDisplayName, businessCode, selectedFiles);

        // Send data to server
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFile = files[0];
            if (newFile) {
                setSelectedFiles((prevFiles) => [...prevFiles, newFile]);
                setUploadProgress((prev) => ({
                    ...prev,
                    [newFile.name]: 0,
                }));


                const interval = setInterval(() => {
                    setUploadProgress((prev) => {
                        const currentProgress = prev[newFile.name] || 0;
                        if (currentProgress >= 100) {
                            clearInterval(interval);
                            return prev;
                        }
                        return {
                            ...prev,
                            [newFile.name]: currentProgress + 2,
                        };
                    });
                }, 50);
            }
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveFile = (fileName: string) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
        setUploadProgress((prevProgress) => {
            const { [fileName]: _, ...rest } = prevProgress;
            return rest;
        });
    };

    return (
        <form onSubmit={handleSubmit} className={style.container}>
            <h2 className={style.title}>חברה חדשה</h2>
            <div className={style.inputs_container}>
                <div className={style.files_container}>
                    <h4 className={style.secondary_title}>העלה מסמכי בעלות חברה</h4>
                    <h6 className={style.secondary_title}>PDF עד 3 מסמכים בפורמט</h6>
                    <button
                        type="button"
                        onClick={handleButtonClick}
                        className={style.uploadButton}
                        disabled={selectedFiles.length >= maxFiles} // השבתה של הכפתור אם הגענו למגבלה
                    >
                        <FaArrowUp /> העלאת מסמכים
                    </button>
                    <input
                        type="file"
                        id="file-upload"
                        ref={fileInputRef}
                        accept=".pdf"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                    {selectedFiles.map((file) => (
                        <div key={file.name} className={style.fileItem}>
                            <div>
                                <h5 className={style.secondary_title}>{file.name}</h5>
                                {uploadProgress[file.name] !== undefined && (
                                    <div className={style.uploadProgressContainer}>
                                        <div
                                            className={style.uploadProgress}
                                            style={{ width: `${uploadProgress[file.name]}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                className={style.removeButton}
                                onClick={() => handleRemoveFile(file.name)}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>
                <div className={style.text_container}>
                    <input
                        type="email"
                        placeholder="אימייל"
                        className={style.input}
                        onChange={(e) => setEmail(e.target.value)}
                        title="אנא הכנס כתובת אימייל תקינה"
                        required
                        pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                    />
                    <input
                        type="password"
                        placeholder="סיסמא"
                        className={style.input}
                        onChange={(e) => setPassword(e.target.value)}
                        title=" הסיסמה חייבת לכלול אותיות קטנות וגדולות ומספרים, באורך לפחות 6 תווים"
                        required
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$"
                    />
                    <input
                        type="text"
                        placeholder="שם עסק רשמי"
                        className={style.input}
                        onChange={(e) => setOfficialBusinessName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="קוד עסק"
                        className={style.input}
                        onChange={(e) => setBusinessCode(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="שם עסק לתצוגה"
                        className={style.input}
                        onChange={(e) => setBusinessDisplayName(e.target.value)}
                        required
                    />
                </div>
            </div>
            <button className={style.submitButton} type="submit">
                הרשם
            </button>
            <Link href="/login" className={style.link}>
                ? חברה / משתמש רשום
            </Link>
            <Link href="/signup" className={style.link}>
                ?משתמש חדש
            </Link>
        </form>
    );
};
