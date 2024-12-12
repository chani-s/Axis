import React, {useState} from "react";
import Header from "../Header/Header";
import MainChat from "../MainChat/MainChat";
import SideBar from "../SideBar/SideBar";
import styles from "./MainPage.module.css"
import Footer from "../Footer/Footer";

// TODO: Add interface for the props

const MainPage = ({type}: any) => { //string should be repleced in user_type struct
    return (
        <div className={styles.page}>
            <Header />
            <div className={styles.mainArea}>
                <SideBar />
                <MainChat type={type} />
            </div>
            <Footer />
        </div>
    )
}

export default MainPage;