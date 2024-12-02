"use client";
import React from "react";
import { CompanyEntrance } from "../components/Entrance/CompanyEntrance";
import style from './company_signup.module.css';

const Company_signupPage = () => {
  return (
    <div className={style.container}>
      <img className={style.backgroundImg} src="/imgs/backgroundLogo.png"></img>
      <CompanyEntrance />
    </div>
  );
};


export default Company_signupPage;
