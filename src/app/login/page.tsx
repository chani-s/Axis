"use client";
import React from "react";
import { Entrance } from "../components/Entrance/UserEntrance";
import style from './login.module.css';

const LoginPage = () => {
    return (
        <div className={style.container}>
            <img className={style.backgroundImg} src="/imgs/backgroundLogo.png"></img>
            <Entrance type="login" />
        </div>
    );
};


export default LoginPage;
