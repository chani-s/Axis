import React, { useState } from "react";
import { Conversation } from "@/app/models/Conversation";
import styles from "./SideBar.module.css";

const SideBar = () => {

    const [conversations, setConversations] = useState<Conversation[]>([]);  // Initialize as an empty array
const arr=[1,2,3];

return (
    <div className={styles.sideBar}>
      <div className={styles.inputs}>
        <input
          className={styles.input}
          type="text"
          placeholder="חיפוש חברה חדשה..."
        />
        <input
          className={styles.input}
          type="text"
          placeholder="חפש בצאטים..."
        />
      </div>
      <p className={styles.yourChatsP}>הצאטים שלך</p>
      {arr.map((c) => (
        <div className={styles.conversationItem}>
          <img className={styles.profileCircle}/>
          <p className={styles.name}>comapny</p>
        </div>
      ))}
    </div>
  );
};

export default SideBar;
