import React, { useState, useRef, useEffect } from "react";
import styles from "./MainChat.module.css";
import Pusher from "pusher-js";
// import PermissionPanel from "../PermissionPanel/PermissionPanel";
import { FaTimes, FaBars, FaArrowLeft, FaWindowMinimize, FaInfoCircle } from "react-icons/fa";
import DetailsBar from "./DetailsBar/DetailsBar";
import { conversationsStore, userDetailsStore, } from "../../../services/zustand";
import { getMessages } from "@/app/services/message";
import { deleteConversation } from "@/app/services/conversation";

interface MessageObj {
    time: Date;
    text: string;
    sender?: string;
    conversationId: string;
}

const MainChat = ({ type }: any) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isPermissionPanelOpen, setIsPermissionPanelOpen] = useState(false);
    const [messages, setMessages] = useState<MessageObj[]>([]); // Default as empty array
    const [message, setMessage] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [isUser, setIsUser] = useState(true);
    const [isShowDetails, setIsShowDetails] = useState(false);
    const userDetails = userDetailsStore((state) => state.userDetails);
    const { conversation, setConversation } = conversationsStore();
      

    useEffect(() => {
        if (!conversation?._id) return;
        const loadConversationMessages = async () => {
            if (conversation?._id) {
                try {
                    setIsChatOpen(true);
                    const previousMessages = await getMessages(conversation._id,type);
                    if (previousMessages.length > 0) {
                        setMessages(previousMessages);
                    }

                } catch (error) {
                    console.error("Failed to load previous conversation messages", error);
                }
            }
        };

        loadConversationMessages();


        const pusher = new Pusher('ff054817599b88393e16', {
            cluster: 'ap2',
        });

        const conversationChannel = `chat-channel-${conversation._id}`;
        const channel = pusher.subscribe(conversationChannel);

        // Bind the new-message event
        channel.bind('new-message', (data: MessageObj) => {
            console.log(`Received message for conversation: ${data.conversationId}`);

            if (data.conversationId === conversation._id) {
                setMessages((prevMessages) => [
                    ...(prevMessages || []),
                    { ...data, time: new Date(data.time) }
                ]);
            }
        });


        return () => {
            console.log(`Unsubscribing from channel: ${conversationChannel}`);
            channel.unbind('new-message');
            pusher.unsubscribe(conversationChannel);
            setMessages([]); // Clear messages when switching conversations
        };

    }, [conversation?._id]);
    const sendMessage = async () => {
        if (!message || !conversation._id) return;

        const newMessage: MessageObj = {
            time: new Date(),
            text: message,
            conversationId: conversation._id,
        };

        console.log("Sending message:", newMessage);

        try {
            await fetch("/api/pusher/send-message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    conversationId: conversation._id,
                    message: newMessage,
                }),
            });
            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    useEffect(() => {
        if (type === "representative") {
            setIsUser(false);
        }
    }, [type]);

    useEffect(() => {
        const chatMessagesElement = chatEndRef.current?.parentElement;
        chatMessagesElement?.scrollTo({
            top: chatMessagesElement.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    const closeChat = () => {
        setIsChatOpen(false);
        setConversation({ _id: "" });
    };

    const managePermissions = () => {
        setIsPermissionPanelOpen((prev) => !prev);
    };

    const minimize = () => {
        setIsMinimized(!isMinimized);
    };

    const endConversation = async () => {
        alert("האם את בטוח שאתה רוצה לסגור את הפניה?");
        await deleteConversation(conversation._id)
        closeChat();
    };

    const handleKeyPress = (e: any) => {
        if (e.key === "Enter") {
            sendMessage();
        }
        console.log(userDetails._id)
    };

    const handleChange = (e: any) => {
        setMessage(e.target.value);
    };

    const showDetails = () => {
        setIsShowDetails((prev) => !prev);
    };

    if (!isChatOpen) {
        return <div className={styles.mainChatNone}>
            <p>לא נבחרה שיחה...🫣</p><br/>
            <h3>בחר שיחה כדי להתחיל 🤗        </h3>
        </div>;
    }

    return (
        <div
            className={`${styles.mainChat} ${isMinimized ? styles.minimized : ""}`}
        >
            <div className={styles.header}>
                <div className={styles.rightButtons}>
                    <button className={styles.closeButton} onClick={closeChat}>
                        <FaTimes />
                    </button>
                    <button className={styles.minimizeButton} onClick={minimize}>
                        <FaWindowMinimize />
                    </button>
                </div>
                {isUser && <button
                    className={styles.detailsIcon}
                    onClick={managePermissions}
                    data-tooltip={"ניהול ההרשאות לנתונים שלך"}
                >
                    <FaInfoCircle />
                </button>}
            </div>
            {isPermissionPanelOpen && <DetailsBar type="user" />}

            <div className={styles.chatMessages}>
                {messages
                    ?.filter((msg) => msg.conversationId === conversation._id)
                    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
                    .map((msg, index) => {
                        const messageDate = new Date(msg.time);
                        const isToday = messageDate.toDateString() === new Date().toDateString();

                        return (
                            <div
                                key={index}
                                className={`${styles.message} ${msg.sender === userDetails._id || !msg.sender
                                    ? styles.userMessage
                                    : styles.otherMessage
                                    }`}
                            >
                                <p className={styles.messageText}>{msg.text}</p>
                                <span className={styles.messageTime}>
                                    {!isToday && `${messageDate.toLocaleDateString()}, `}
                                    {messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                            </div>
                        );
                    })}
                <div ref={chatEndRef}></div>
            </div>

            <div className={styles.sendingBar}>
                {!isUser && (
                    <button className={styles.detailsButton} onClick={showDetails}>
                        פרטי לקוח
                    </button>
                )}
                {isShowDetails && <DetailsBar type="representative" />}

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
                    onClick={sendMessage}
                >
                    <FaArrowLeft />
                </button>
                <button
                    className={styles.endButton}
                    onClick={endConversation}
                >
                    <FaTimes/>
                </button>
            </div>

        </div>
    );
};

export default MainChat;
