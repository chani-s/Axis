"use client";
import React from "react";
import { Entrance } from "../components/Entrance/UserEntrance";
import style from './signup.module.css';
export const dynamic = 'force-dynamic';

const SignupPage = () => {
    return (
        <div className={style.container}>
            <img className={style.backgroundImg} src="/imgs/backgroundLogo.png"></img>
            <Entrance type="signup" />
        </div>
    );
};


export default SignupPage;
