import React, {useState} from "react";
import Header from "../Header/Header";
import MainChat from "../MainChat/MainChat";
import SideBar from "../SideBar/SideBar";
import styles from "./MainPage.module.css"
import Footer from "../Footer/Footer";
import { Conversation } from "@/app/models/Conversation";
interface MainPageProps {
    type: string; 
    conversations:Conversation[];
    companiesData:any[];
    createConversation:any;
    chosenConversationId:string
  }
const MainPage : React.FC<MainPageProps> = ({type,conversations,companiesData,createConversation,chosenConversationId}) => { //string should be repleced in user_type struct
    return (
        <div className={styles.page}>
            <Header />
            <div className={styles.mainArea}>
                <SideBar userType={type} conversations={conversations} companiesData={companiesData} createConversation={createConversation} chosenConversationId={chosenConversationId}/>
                <MainChat type={type} />
            </div>
            <Footer />
        </div>
    )
}

export default MainPage;