import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import styles from "./SideBar.module.css";
import { conversationsStore } from "../../../services/zustand";
import { getConversations } from "@/app/services/conversation";
import { Conversation } from "@/app/models/Conversation";

interface SideBarProps {
  userType: string;
  conversations: Conversation[];
  companiesData: any[];
  createConversation: any;
  chosenConversationId: string;
}

const SideBar: React.FC<SideBarProps> = ({
  userType,
  conversations,
  companiesData,
  createConversation,
  chosenConversationId,
}) => {
  // const id = "67504b0fbe15427c891d0cbe";

  const [searchTerm, setSearchTerm] = useState(""); // Search term for company search
  const [chatSearchTerm, setChatSearchTerm] = useState(""); // Search term for chat search
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown visibility
  const [filteredCompanies, setFilteredCompanies] = useState<any[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<
    Conversation[]
  >([]);

  const conversation = conversationsStore((state) => state.conversation);
  const setConversation = conversationsStore((state) => state.setConversation);

  const inputsRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (inputsRef.current && !inputsRef.current.contains(e.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    // Filter companies whenever `searchTerm` or `companiesData` changes
    setFilteredCompanies(
      companiesData?.filter((company: any) => {
        return company.name.toLowerCase().includes(searchTerm.toLowerCase());
      }) || []
    );
    console.log("term" + searchTerm);
  }, [searchTerm, companiesData]);

  useEffect(() => {
    // Filter conversations whenever `chatSearchTerm` or `conversations` changes
    setFilteredConversations(
      conversations?.filter((conversation: any) => {
        return (conversation.company_name?.toLowerCase() || "").includes(
          chatSearchTerm.toLowerCase()
        );
      }) || []
    );
  }, [chatSearchTerm, conversations]);

  useEffect(() => {
    // Handle dropdown visibility
    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isDropdownOpen]);

  const handleCreateConversation = (company: any) => {
    const newConversation = {
      company_id: company._id,
      representative_id: null,
      status_code: 2,
      company_profilePicture: company.profilePicture,
      company_name: company.name,
      last_use: new Date(),
      user_name: "",
      user_profilePicture:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_0xOKHJX8XtB036IK2_Ee28dILxTsB_fbWA&s",
    };
    createConversation(newConversation);

    setConversation({ _id: chosenConversationId });
  };

  const handleOptionClick = (company: any) => {
    setSearchTerm("");
    setIsDropdownOpen(false);
    handleCreateConversation(company);
  };

  const handleConversationClick = (con: Conversation) => {
    if (con._id) {
      setConversation({ _id: con._id.toString() });
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredCompanies.length === 1) {
      const company = filteredCompanies[0];
      handleOptionClick(company);
    }
  };
  const RenderFilteredCompanies = () => {
    if (!filteredCompanies.length) {
      return <div className={styles.noResults}>אין תוצאות</div>;
    }

    return filteredCompanies.map((company: any) => (
      <div
        key={company._id}
        className={styles.optionItem}
        onClick={() => handleOptionClick(company)}
      >
        <div
          className={styles.profileCircle}
          style={{ backgroundImage: `url(${company.profilePicture})` }}
        ></div>
        <span className={styles.selectOptionText}>{company.name}</span>
      </div>
    ));
  };

  return (
    <div className={styles.sideBar}>
      {userType === "user" && (
        <div ref={inputsRef} className={styles.inputs}>
          <input
            className={styles.input}
            type="text"
            placeholder="חפש חברה חדשה..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);

              if (e.target.value === "") {
                setIsDropdownOpen(false);
              }
            }}
            // onFocus={() => {
            //   // handleInputFocus();
            //   setIsDropdownOpen(true);
            // }}
            onKeyDown={handleKeyPress}
          />
          {isDropdownOpen && (
            <div className={styles.selectOptions}>
              <RenderFilteredCompanies />
            </div>
          )}
          <input
            className={styles.input}
            type="text"
            placeholder="חפש בצאטים..."
            value={chatSearchTerm}
            onChange={(e) => {
              setChatSearchTerm(e.target.value);
            }}
            onFocus={() => {
              setIsDropdownOpen(false);
            }}
          />
        </div>
      )}
      <p className={styles.yourChatsP}>הצאטים שלך:</p>
      <div className={styles.bottom}>
        {filteredConversations ? (
          filteredConversations.map((mapConversation: Conversation) => {
            const isSelected =
              conversation._id === mapConversation._id?.toString();

            return (
              <div
                onClick={() => handleConversationClick(mapConversation)}
                className={`${styles.conversationItem} ${
                  isSelected ? styles.selected : ""
                }`}
                style={{ backgroundColor: isSelected ? "#ddba0e" : "" }}
                key={mapConversation._id?.toString()}
              >
               <img
  className={styles.profileCircle}
  src={
    userType === "user"
      ? mapConversation.company_profilePicture
      : mapConversation.user_profilePicture || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_0xOKHJX8XtB036IK2_Ee28dILxTsB_fbWA&s"
  }
  alt="Profile"
/>
                <p className={styles.name}>
                  {userType === "user"
                    ? mapConversation.company_name
                    : mapConversation.user_name
                    ? mapConversation.user_name
                    : "פניה חדשה"}
                </p>{" "}
              </div>
            );
          })
        ) : (
          <div className={styles.noResults}>לא נמצאו תוצאות</div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
