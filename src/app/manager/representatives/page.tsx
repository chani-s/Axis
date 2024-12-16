"use client";
import React from "react";
import { Representatives } from "../../components/Representatives/Representatives";
import style from './representatives.module.css';

const LoginPage = () => {
    return (
        <div className={style.container}>
            <img className={style.backgroundImg} src="/imgs/backgroundLogo.png"></img>
            <Representatives />
        </div>
    );
};


export default LoginPage;
