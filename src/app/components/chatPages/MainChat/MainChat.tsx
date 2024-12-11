import React, { useState, useRef, useEffect } from "react";

import styles from "./MainChat.module.css";
import Pusher from 'pusher-js';
import PermissionPanel from "../PermissionPanel/PermissionPanel";
import { FaTimes, FaBars, FaArrowLeft, FaWindowMinimize } from 'react-icons/fa';
import DetailsBar from "./DetailsBar/DetailsBar";
import { userDetailsStore } from '../../../services/zustand';


interface MessageObj {
    time: Date,
    text: string,
    sender: string,     
};

const MainChat = ({ type }: any) => {
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isPermissionPanelOpen, setIsPermissionPanelOpen] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [messages, setMessages] = useState<MessageObj[]>();
    const [message, setMessage] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [isUser, setIsUser] = useState(true);
    const [isShowDetails, setIsShowDetails] = useState(false);
    const userDetails = userDetailsStore((state) => state.userDetails); 

    useEffect(() => {
        const pusher = new Pusher('ff054817599b88393e16', {
            cluster: 'ap2'
        });

        // התחברות לערוץ ולהגדרת אירועים
        const channel = pusher.subscribe('chat-channel');
        channel.bind('new-message', (data: MessageObj) => {
            // עדכון ההודעות בצד הלקוח עם הודעות שנשלחות ע"י נציגים
            // setMessages((prevMessages) => [...(prevMessages || []), data]);
            setMessages((prevMessages) => [
                ...(prevMessages || []),
                { ...data, time: new Date(data.time) }
            ]);
            
        });

        return () => {
            pusher.unsubscribe('chat-channel');
        };
    }, []);

    const sendMessage = async () => {
        if (!message) return;
     
        const newMessage: MessageObj = {
            time: new Date(),
            text: message,
            sender: userDetails._id, // הודעה שנשלחת על ידי המשתמש
        };
     
        console.log('Sending message:', newMessage);  // בודק מה נשלח
     
        // setMessages((prevMessages) => [...(prevMessages || []), newMessage]);
     
        await fetch('/api/pusher/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: newMessage }),
        });
     
        setMessage('');
    }     

    useEffect(() => {
        if (type === "representative") {
            setIsUser(false);
        }

    }, [type]);

    useEffect(() => {
        const chatMessagesElement = chatEndRef.current?.parentElement; 
        chatMessagesElement?.scrollTo({ top: chatMessagesElement.scrollHeight, behavior: "smooth" });
    }, [messages]);

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

    const handleChange = (e: any) => {
        setMessage(e.target.value);
    };


    if (!isChatOpen) {
        return null;
    }

    const showDetails = () => {
        setIsShowDetails((prev) => !prev);
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
                    <div key={index} className={`${styles.message} ${msg.sender===userDetails._id ? styles.userMessage : styles.otherMessage}`}>
                        <p className={styles.messageText}>{msg.text}</p>
                        <span className={styles.messageTime}>
                            {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
                <div ref={chatEndRef}></div>
            </div>

            <div className={styles.sendingBar}>

                {!isUser &&
                    <button
                        className={styles.detailsButton}
                        onClick={showDetails}>
                        פרטי לקוח
                    </button>}
                {isShowDetails && <DetailsBar />}

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