import React from "react";
import Header from "../Header/Header";
import MainChat from "../MainChat/MainChat";
import SideBar from "../SideBar/SideBar";
import styles from "./MainPage.module.css"

const MainPage = () => {
    return (
        <div className={styles.page}>
            <Header />
            <div className={styles.mainArea}>
                <MainChat />
                <SideBar />
            </div>
        </div>
    )
}

export default MainPage;