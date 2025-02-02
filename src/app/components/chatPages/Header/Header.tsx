import React, { useState } from "react";
import styles from "./Header.module.css";
import ProfilePopup from "./ProfilePopup/ProfilePopup";
import { conversationsStore, userDetailsStore } from "../../../services/zustand";
import { useRouter } from "next/navigation";
import { logout } from "@/app/services/logout";
import { MdOutlineLogout } from "react-icons/md";

const Header = () => {
    const userDetails = userDetailsStore((state) => state.userDetails);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const router = useRouter();
    const { conversation, setConversation } = conversationsStore();

    const handleLogout = async () => {
        try {
            if (userDetails.user_type === "representative")
                userDetails.status = "inactive";
            const userData = {
                email: userDetails.email,
                name: userDetails.name,
                companyId: userDetails.company_id || null,
                user_type: userDetails.user_type,
            }
            await logout(userData);
            setConversation({ _id: "" })
            router.push("/login");
            
        } catch (error) {
            console.error("Error during logout process:", error);
        }
    };
    const showPersonalProfile = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };
    console.log(userDetails.profile_picture);

    return (
        <div className={styles.header}>
            <div className={styles.basicDetails}
                title={userDetails.name + "\n" + userDetails.email}>
                <img
                    className={styles.profilePicture}
                    src={userDetails.profile_picture}
                    alt="profile"
                    onClick={showPersonalProfile}>
                </img>
                <p>{userDetails.name}</p>

            </div>
            <MdOutlineLogout
                className={styles.logoutIcon}
                onClick={handleLogout} />

            <img
                className={styles.logo}
                src="/imgs/nonebg1.png"
                alt="logo">
            </img>

            {isPopupOpen && (
                <ProfilePopup
                    onClose={closePopup}
                />
            )}
        </div>
    )
}
export default Header;
