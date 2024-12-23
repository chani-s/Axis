import React, { useState } from "react";
import styles from "./Header.module.css";
import ProfilePopup from "./ProfilePopup/ProfilePopup";
import { userDetailsStore } from "../../../services/zustand";
import { useRouter } from "next/navigation"; // Use next/navigation for Next.js 13 and later
import { logout } from "@/app/services/logout";
import { MdOutlineLogout } from "react-icons/md";

const Header = () => {
  const userDetails = userDetailsStore((state) => state.userDetails);
  const [userName, setUserName] = useState("ללא שם");
  const [userEmail, setUserEmail] = useState("abc@gmail.com");
  const [profilePicture, setProfilePicture] = useState(
    "https://www.mamanet.org.il/MamanetPlayersPictures/Screen-Shot-2022-06-15-at-13.38.00-274x300.png"
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const router = useRouter();

  const showPersonalProfile = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const saveProfile = (
    newUserName: string,
    newEmail: string,
    newProfilePic: string
  ) => {
    setUserName(newUserName);
    setUserEmail(newEmail);
    setProfilePicture(newProfilePic);
  };

  const handleLogout = async () => {
    try {
      // Perform logout
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Error during logout process:", error);
    }
  };

  return (
    <div className={styles.header}>
      <div
        className={styles.basicDetails}
        title={userDetails.name + "\n" + userDetails.email}
      >
        <img
          className={styles.profilePicture}
          src={profilePicture}
          alt="profile"
          onClick={showPersonalProfile}
        />
        <p>{userDetails.name}</p>
      </div>
      <MdOutlineLogout className={styles.logoutIcon} onClick={handleLogout} />
      <img className={styles.logo} src="/imgs/nonebg1.png" alt="logo" />

      {isPopupOpen && <ProfilePopup onClose={closePopup} />}
    </div>
  );
};

export default Header;
