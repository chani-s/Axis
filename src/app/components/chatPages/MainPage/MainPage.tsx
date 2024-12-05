import React, {useState} from "react";
import Header from "../Header/Header";
import MainChat from "../MainChat/MainChat";
import SideBar from "../SideBar/SideBar";
import styles from "./MainPage.module.css"

const MainPage = ({type}: any) => { //string should be repleced in user_type struct
console.log(type);
    return (
        <div className={styles.page}>
            <Header />
            <div className={styles.mainArea}>
                <SideBar />
                <MainChat type={type} />
            </div>
        </div>
    )
}

export default MainPage;