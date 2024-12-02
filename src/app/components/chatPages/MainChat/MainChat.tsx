import React, { useState } from "react";
import styles from "./MainChat.module.css";
import PermissionPanel from "../PermissionPanel/PermissionPanel";
import { FaTimes, FaBars, FaArrowLeft, FaWindowMinimize } from 'react-icons/fa';

interface MessageObj {
    time: Date,
    text: string,
    sender: Boolean,  // true if sender is user, false otherwise      
};
const MainChat = () => {
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isPermissionPanelOpen, setIsPermissionPanelOpen] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [messages, setMessages] = useState<MessageObj[]>();
    const [message, setMessage] = useState("");


    const closeChat = () => {
        setIsChatOpen(false);
    };

    const managePermissions = () => {
        setIsPermissionPanelOpen((prev) => !prev);
    };

    const minimize = () => {
        setIsMinimized(!isMinimized);
    };

    const handleKeyPress = (e: any) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    const sendMessage = () => {
        if (!message) return;
        setIsSent(true);
        console.log('sendMessage', message);
        const newMessage: MessageObj = {
            time: new Date(),
            text: message,
            sender: true,
        };
        const newMessage1: MessageObj = {
            time: new Date(),
            text: message,
            sender: false,
        };
        setMessages((prevMessages) => prevMessages ? [...prevMessages, newMessage] : [newMessage]);
        setMessages((prevMessages) => prevMessages ? [...prevMessages, newMessage1] : [newMessage1]);

        setMessage("");
    };

    const handleChange = (e: any) => {
        setMessage(e.target.value);
    };


    if (!isChatOpen) {
        return null;
    }
    return (
        <div className={`${styles.mainChat} ${isMinimized ? styles.minimized : ""}`}>
            <div className={styles.header}>
                <div className={styles.rightButtons}>
                    <button
                        className={styles.closeButton}
                        onClick={closeChat}>
                        <FaTimes />
                    </button>
                    <button
                        className={styles.minimizeButton}
                        onClick={minimize}>
                        <FaWindowMinimize />
                    </button>
                </div>
                <button
                    className={styles.hamburger}
                    onClick={managePermissions}
                    data-tooltip={"ניהול ההרשאות לנתונים שלך"}
                >
                    <FaBars />
                </button>
            </div>
            {isPermissionPanelOpen && <PermissionPanel />}

            <div className={styles.chatMessages}>
                {messages?.sort((a, b) => a.time.getTime() - b.time.getTime()).map((msg, index) => (
                    <div
                        key={index}
                        className={`${styles.message} ${msg.sender ? styles.userMessage : styles.otherMessage}`}>
                        <span className={styles.messageTime}>{msg.time.toLocaleTimeString()}</span>
                        <p className={styles.messageText}>{msg.text}</p>
                    </div>
                ))}
            </div>

            <div className={styles.sendingBar}>
                <input
                    className={styles.inputField}
                    type="text"
                    placeholder="הקלד כאן..."
                    value={message}
                    onKeyDown={handleKeyPress}
                    onChange={handleChange}
                />
                <button
                    type="submit"
                    className={styles.sendButton}
                    onClick={sendMessage}>
                    <FaArrowLeft />
                </button>
            </div>

        </div>
    )
}

export default MainChat;