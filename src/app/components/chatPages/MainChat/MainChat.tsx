import React, { useState } from "react";
import styles from "./MainChat.module.css";
import PermissionPanel from "../PermissionPanel/PermissionPanel";
import { FaTimes, FaBars, FaArrowLeft, FaWindowMinimize } from 'react-icons/fa';

const MainChat = () => {
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isPermissionPanelOpen, setIsPermissionPanelOpen] = useState(false);
    const [isSent, setIsSent] = useState(false);

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
        setIsSent(true);
        console.log('sendMessage');
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
                {isPermissionPanelOpen && <PermissionPanel />}
                <button
                    className={styles.hamburger}
                    onClick={managePermissions}>
                    <FaBars />
                </button>
            </div>

            <div className={styles.sendingBar}>
                <input
                    className={styles.inputField}
                    type="text"
                    placeholder="הקלד כאן..."
                    onKeyDown={handleKeyPress}
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