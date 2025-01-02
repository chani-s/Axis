"use client";
import React from "react";
import { Representatives } from "../../components/Representatives/Representatives";
import style from './representatives.module.css';

const LoginPage = () => {
    return (
        <div>
            <div className={style.container}>
                <Representatives />
            </div>
        </div>
    );
};


export default LoginPage;
