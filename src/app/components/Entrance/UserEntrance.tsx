"use client";
import React, { useState } from "react";
import Link from "next/link";
import style from "./UserEntrance.module.css";
import { googleSignup } from '../../services/auth';
import { FcGoogle } from "react-icons/fc";
import { useMutation } from 'react-query';
import { signUpUser, loginUser } from '../../services/user';

export const Entrance = ({ type }: any) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isWithGoogle, setIsWithGoogle] = useState(false);

    const mutationSignUp = useMutation(signUpUser, {
        onSuccess: () => {
            alert('User signed up successfully!');
        },
        onError: (error: any) => {
            alert(`Error signing up: ${error.message}`);
        },
    });

    const mutationLogin = useMutation(loginUser, {
        onSuccess: () => {
            alert('User signed up successfully!');
        },
        onError: (error: any) => {
            alert(`Error signing up: ${error.message}`);
        },
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const userData = {
            email: email,
            password: password,
            isWithGoogle: false
        };
        type=="signup"?mutationSignUp.mutate(userData):mutationLogin.mutate(userData);
    }

    const signupHandler = async () => {
        const res = await googleSignup();
        setIsWithGoogle(true);
        const emailFromGoogle=res.user.email;
        setEmail(emailFromGoogle);
        const nameFromGoogle=res.user.displayName;
        setName(nameFromGoogle);
        console.log(emailFromGoogle, nameFromGoogle);
        const userData = {
            email: email,
            password: password,
            isWithGoogle: isWithGoogle
        };
        type=="signup"?mutationSignUp.mutate(userData):mutationLogin.mutate(userData);

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
            < button className={style.googleButton} onClick={signupHandler} ><FcGoogle className={style.googleIcon}/> {type} with Google </button>
            < button className={style.submitButton} type="submit" > {type == "login" ? "הכנס" : "הרשם"} </button>
            < Link href={type == "login" ? "/signup" : "/login"} className={style.link} > {type == "login" ? "משתמש חדש?" : "משתמש רשום?"} </Link>
            < Link href="/company_signup" className={style.link} >חברה חדשה?</Link>
        </form>

    );
};
