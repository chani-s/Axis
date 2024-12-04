import React, { useEffect, useState } from "react";
import { FaUser, FaPhone, FaHome, FaIdCard, FaCreditCard } from "react-icons/fa";
import styles from "./PermissionPanel.module.css";

const iconsMapping = {
    phone: <FaPhone />,
    address: <FaHome />,
    id: <FaIdCard />,
    bank: <FaCreditCard />,
};

const defaultPermissions = {
    phone: false,
    address: false,
    id: false,
    bank: false,
};

const PermissionPanel = () => {

    const [permissions, setPermissions] = useState<typeof defaultPermissions>(defaultPermissions);

    // const [permissions, setPermissions] = useState({
    //     phone: false,
    //     address: false,
    //     id: false,
    //     bank: false,
    // });

    useEffect(() => {
        const storedPermissions = localStorage.getItem("permissions");
        if (storedPermissions) {
            setPermissions(JSON.parse(storedPermissions));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("permissions", JSON.stringify(permissions));
    }, [permissions]);

    const togglePermission = (key: keyof typeof permissions) => {
        setPermissions((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const descriptions: Record<keyof typeof permissions, string> = {
        phone: "הרשאת גישה למספר הטלפון",
        address: "הרשאת גישה לכתובת",
        id: "הרשאת גישה לתעודת הזהות",
        bank: "הרשאת גישה לפרטי חשבון הבנק"
    };

    return (
        <div className={styles.permissionPanel}>
            {Object.entries(permissions).map(([key, hasPermission]) => (
                <div
                    key={key}
                    className={`${styles.permissionIcon} ${
                        hasPermission ? styles.allowed : styles.denied
                    }`}
                    onClick={() => togglePermission(key as keyof typeof permissions)}
                    data-tooltip={descriptions[key as keyof typeof permissions]}
                >
                    {iconsMapping[key as keyof typeof permissions]}
                </div>
            ))}
        </div>
    );
};

export default PermissionPanel;
