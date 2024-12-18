import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import MainChat from "../MainChat/MainChat";
import SideBar from "../SideBar/SideBar";
import styles from "./MainPage.module.css"
import Footer from "../Footer/Footer";
import { Conversation } from "@/app/models/Conversation";
import DetailsPopUp from "../DetailsPopUp/DetailsPopUp";


interface MainPageProps {
    type: string;
    conversations: Conversation[];
    companiesData: any[];
    createConversation: any;
    chosenConversationId: string
}
const MainPage: React.FC<MainPageProps> = ({ type, conversations, companiesData, createConversation, chosenConversationId }) => { //string should be repleced in user_type struct
    const [isDetailsPopUpVisible, setIsDetailsPopUpVisible] = useState(true);

    useEffect(() => {
        setIsDetailsPopUpVisible(true);
    }, []);

    return (
        <div className={styles.page}>
            <Header />
            <div className={styles.mainArea}>
                <SideBar userType={type} conversations={conversations} companiesData={companiesData} createConversation={createConversation} chosenConversationId={chosenConversationId} />
                <MainChat type={type} />
            </div>
            <Footer />
            {isDetailsPopUpVisible && (
                <DetailsPopUp onClose={() => setIsDetailsPopUpVisible(false)} />
            )}
        </div>
    )
}

export default MainPage;