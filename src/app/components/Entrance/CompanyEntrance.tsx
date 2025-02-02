"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import style from "./CompanyEntrance.module.css";
import { FaArrowUp, FaTrash } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { showError, showSuccess } from "../../services/messeges";
import { signUpCompany } from "../../services/company";

export const CompanyEntrance = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [officialBusinessName, setOfficialBusinessName] = useState("");
    const [businessDisplayName, setBusinessDisplayName] = useState("");
    const [businessCode, setBusinessCode] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isLoadding, setIsLoadding] = useState(false);
    const maxFiles = 3;
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>(
        {}
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const mutationSignUp = useMutation({
        mutationFn: signUpCompany,
        onMutate: () => {
            console.log("start");
            setIsLoadding(true);
        },
        onSuccess: (data: any) => {
            console.log(isLoadding);
            console.log(data);
            if (data.userDetails.businessDisplayName) {
                showSuccess("בקשתך להרשמת חברה נשלחה בהצלחה");
                setIsLoadding(false);
            }
            else {
                setIsLoadding(false);
                showError("נסה שוב או התחבר");
            }
        },
        onError: (error: any) => {
            setIsLoadding(false);
            console.log(error.message);
            showError("נסה שוב או התחבר");
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userData = {
            email: email,
            password: password,
            officialBusinessName: officialBusinessName,
            businessDisplayName: businessDisplayName,
            businessCode: businessCode,
            profilePicture: profilePicture,
        };
        console.log(userData);

        mutationSignUp.mutate(userData);
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
        <>
            {isLoadding && (
                <div className={style.loading_dots}>
                    <div className={style.dot}></div>
                    <div className={style.dot}></div>
                    <div className={style.dot}></div>
                </div>
            )}
            {!isLoadding &&
                <form onSubmit={handleSubmit} className={style.container}>
                    <h2 className={style.title}>חברה חדשה</h2>
                    <div className={style.inputs_container}>

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
                            <input
                                type="text"
                                placeholder="קישור ללוגו החברה"
                                className={style.input}
                                onChange={(e) => setProfilePicture(e.target.value)}
                                required
                            />
                        </div>
                        {/*<div className={style.files_container}>
                            <h4 className={style.secondary_title}>העלה מסמכי בעלות חברה</h4>
                            <h6 className={style.secondary_title}>PDF עד 3 מסמכים בפורמט</h6>
                            <button
                                type="button"
                                onClick={handleButtonClick}
                                className={style.uploadButton}
                                disabled={selectedFiles.length >= maxFiles}
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
                        </div>*/}
                    </div>
                    <button className={style.submitButton} type="submit">
                        הרשם
                    </button>
                    <Link href="/login" className={style.link}>
                        חברה / משתמש רשום?
                    </Link>
                    <Link href="/signup" className={style.link}>
                        משתמש חדש?
                    </Link>
                </form>}
        </>
    );
};
