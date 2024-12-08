"use client";
import React, { useState } from "react";
import Link from "next/link";
import style from "./UserEntrance.module.css";
import { googleSignup } from '../../services/auth';
import { FcGoogle } from "react-icons/fc";
import { useMutation } from '@tanstack/react-query';
import { signUpUser, loginUser } from '../../services/user';
import { useRouter } from 'next/navigation';
import { userDetailsStore } from '../../services/zustand'

export const Entrance = ({ type }: any) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isWithGoogle, setIsWithGoogle] = useState(false);
    const router = useRouter();
    const userDetails = userDetailsStore((state) => state.userDetails);
    const setUserDetails = userDetailsStore((state) => state.setUserDetails);

    const mutationSignUp = useMutation({
        mutationFn: signUpUser,
        onSuccess: (data: any) => {
            console.log(data);
            if (data.userId != "") {
                const userDetails = {
                    _id: data.userDetails._id,
                    email: data.userDetails.email,
                    google_auth: data.userDetails.google_auth || false,
                    user_type: data.userDetails.user_type,
                };
                setUserDetails(data.userDetails);
                console.log(userDetails);
                if (data.userDetails.user_type == "user")
                    router.push('/chat/user');
                if (data.userDetails.user_type == "representative")
                    router.push('/chat/representative');
                if (data.userDetails.user_type == "management")
                    router.push('/chat/management');
            }
            else {
                alert("שגיאה בהרשמה נסה שוב או התחבר");
            }
        },
        onError: (error: any) => {
            alert(`שגיאה בהרשמה ${<br />} ${error.message}`);
        },
    });

    const mutationLogin = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            console.log(data);
            if (data.userId != "") {
                const userDetails = {
                    _id: data.userDetails._id,
                    email: data.userDetails.email,
                    google_auth: data.userDetails.google_auth || false,
                    user_type: data.userDetails.user_type,
                };
                setUserDetails(userDetails);
                if (data.userDetails.user_type == "user")
                    router.push('/chat/user');
                if (data.userDetails.user_type == "representative")
                    router.push('/chat/representative');
                if (data.userDetails.user_type == "management")
                    router.push('/chat/management');

                console.log(userDetails);
            } else {
                alert("אימייל או סיסמא שגויים");
            }
        },
        onError: (error: any) => {
            alert(`שגיאה בהתחברות ${<br />} ${error.message}`);

        },
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (type == "signup") {
            const userData = {
                email: email,
                password: password,
                isWithGoogle: false,
                userType: "user"
            };
            mutationSignUp.mutate(userData)
        }
        if (type == "login") {
            const userData = {
                email: email,
                password: password,
                isWithGoogle: false
            };
            mutationLogin.mutate(userData)
        }
    }

    const signupHandler = async () => {
        const res = await googleSignup();
        setIsWithGoogle(true);
        const emailFromGoogle = res.user.email;
        setEmail(emailFromGoogle);
        const nameFromGoogle = res.user.displayName;
        setName(nameFromGoogle);
        console.log(emailFromGoogle, nameFromGoogle);
        const userData = {
            email: email,
            password: password,
            isWithGoogle: isWithGoogle,
            userType: "user"
        };
        type == "signup" ? mutationSignUp.mutate(userData) : mutationLogin.mutate(userData);

    }

    return (

        <form onSubmit={handleSubmit} className={style.container}>
            <h2 className={style.title}>{type == "login" ? "התחברות" : "רישום"}</h2>
            < div className={style.inputContainer}>
                <input type="email" placeholder="אימייל" className={style.input}
                    onChange={(e) => setEmail(e.target.value)}
                    title="אנא הכנס כתובת אימייל תקינה" required pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" />
                <input type="password" placeholder="סיסמא" className={style.input}
                    onChange={(e) => setPassword(e.target.value)}
                    title=" הסיסמה חייבת לכלול אותיות קטנות וגדולות ומספרים, באורך לפחות 6 תווים" required pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$" />
            </div>
            < button className={style.googleButton} onClick={signupHandler} ><FcGoogle className={style.googleIcon} /> {type} with Google </button>
            < button className={style.submitButton} type="submit" > {type == "login" ? "הכנס" : "הרשם"} </button>
            < Link href={type == "login" ? "/signup" : "/login"} className={style.link} > {type == "login" ? "משתמש חדש?" : "משתמש רשום?"} </Link>
            < Link href="/company_signup" className={style.link} >חברה חדשה?</Link>
        </form>

    );
};
