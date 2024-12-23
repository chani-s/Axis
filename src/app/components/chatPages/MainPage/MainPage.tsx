import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import MainChat from "../MainChat/MainChat";
import SideBar from "../SideBar/SideBar";
import styles from "./MainPage.module.css";
import Footer from "../Footer/Footer";
import { Conversation } from "@/app/models/Conversation";
import DetailsPopUp from "../DetailsPopUp/DetailsPopUp";
import { userDetailsStore } from "../../../services/zustand";
import Link from "next/link";

interface MainPageProps {
  type: string;
  conversations: Conversation[];
  companiesData: any[];
  createConversation: any;
  chosenConversationId: string;
}

const MainPage: React.FC<MainPageProps> = ({
  type,
  conversations,
  companiesData,
  createConversation,
  chosenConversationId,
}) => {
  const [isDetailsPopUpVisible, setIsDetailsPopUpVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const { userDetails, setUserDetails, getMissingDetails } = userDetailsStore();
  const [missingDetails, setMissingDetails] = useState<string[]>([]);

  useEffect(() => {
    const user = localStorage.getItem("userDetails");
          setIsLogin(true);

    if (user) {
      const parsedUser = JSON.parse(user);
      setUserDetails(parsedUser);
      setIsLogin(true);

      const updatedMissingDetails = getMissingDetails();
      setMissingDetails(updatedMissingDetails);
      if (updatedMissingDetails.length > 0) {
        setIsDetailsPopUpVisible(true);
      }
      else{
        const updatedMissingDetails2=getMissingDetails();
        setMissingDetails(updatedMissingDetails2)
        if(updatedMissingDetails2.length>0){
setIsLogin(false);
        }
      }
    
    }
  }, [setUserDetails, getMissingDetails]);

  if (!isLogin) {
    return (
      <div className={styles.popupBackground}>
        <div className={styles.popupContainer}>
          <h2>אנחנו לא מכירים :(</h2>
          <p>אנא התחבר מחדש על מנת לעדכן את הפרטים.</p>
          <Link href="/login" className={styles.popupButton}>
            כניסה
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.mainArea}>
        <SideBar
          userType={type}
          conversations={conversations}
          companiesData={companiesData}
          createConversation={createConversation}
          chosenConversationId={chosenConversationId}
        />
        <MainChat type={type} />
      </div>
      <Footer />
      {isDetailsPopUpVisible && (
        <DetailsPopUp onClose={() => setIsDetailsPopUpVisible(false)} />
      )}
    </div>
  );
};

export default MainPage;
