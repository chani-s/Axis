import React, { useEffect, useState } from "react";
import { FaUser, FaPhone, FaHome, FaIdCard, FaCreditCard } from "react-icons/fa";
import styles from "./DetailsBar.module.css";

const iconsMapping = {
    phone: <FaPhone />,
    address: <FaHome />,
    id: <FaIdCard />,
    bank: <FaCreditCard />,
};

const defaultDetails = {
    phone: false,
    address: false,
    id: false,
    bank: false,
};

const DetailsBar = ({ type }: { type: string }) => {
    const [isUser, setIsUser] = useState(true);
    const [details, setDetails] = useState<typeof defaultDetails>(defaultDetails);

    if (type != "user")
        setIsUser(false);

    useEffect(() => {
        const storedPermissions = localStorage.getItem("details");
        if (storedPermissions) {
            setDetails(JSON.parse(storedPermissions));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("permissions", JSON.stringify(details));
    }, [details]);

    const toggleDetail = (key: keyof typeof details) => {
        setDetails((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const descriptions: Record<keyof typeof details, string> = {
        phone: "הרשאת גישה למספר הטלפון",
        address: "הרשאת גישה לכתובת",
        id: "הרשאת גישה לתעודת הזהות",
        bank: "הרשאת גישה לפרטי חשבון הבנק"
    };

    const handleAllowedClick = (key: string) => {
        alert(`נתונים גלויים למשתמש: ${descriptions[key as keyof typeof details]}`);
    };

    const handleDeniedClick = (key: string) => {
        alert(`מבקש הרשאה לגשת לנתון: ${descriptions[key as keyof typeof details]}`);
    };

    const handleMissingClick = (key: string) => {
        alert(`אנא הוסף נתון זה: ${descriptions[key as keyof typeof details]}`);
    };

    return (
        <div className={`${styles.permissionPanel} ${isUser ? styles.userPosition : styles.defaultPosition}`}
>
            {Object.entries(details).map(([key, hasDetail], index) => {
                let buttonType: "allowed" | "denied" | "missing" =
                    index === 0
                        ? "missing"
                        : index === Object.entries(details).length - 1
                            ? "allowed"
                            : "denied";

                const onClickHandler =
                    buttonType === "allowed"
                        ? () => handleAllowedClick(key)
                        : buttonType === "denied"
                            ? () => handleDeniedClick(key)
                            : () => handleMissingClick(key);
                return (
                    <div
                        key={key}
                        className={`${styles.permissionIcon} ${styles[buttonType]}`}
                        onClick={onClickHandler}
                        data-tooltip={descriptions[key as keyof typeof details]}
                    >
                        {iconsMapping[key as keyof typeof details]}
                    </div>
                );
            })}
        </div>

    );
};

export default DetailsBar;
