import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import styles from "./SideBar.module.css";
import {
  conversationsStore,
  userDetailsStore,
} from "../../../services/zustand";
import {
  getConversations,
  statusConversation,
} from "@/app/services/conversation";
import { Conversation } from "@/app/models/Conversation";
import Link from "next/link";
import { FaCog } from "react-icons/fa";
import Pusher from "pusher-js";

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
  const [searchTerm, setSearchTerm] = useState(""); // Search term for company search
  const [chatSearchTerm, setChatSearchTerm] = useState(""); // Search term for chat search
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown visibility
  const [filteredCompanies, setFilteredCompanies] = useState<any[]>([]);
  const [conversationsHadChange, setConversationsHadChange] = useState<
  { conversationId: string; userId: string }[]
>([]);
  const userDetails = userDetailsStore((state) => state.userDetails);

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
        return company.businessDisplayName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
      }) || []
    );
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
  }, [chatSearchTerm, conversations, chosenConversationId]);

  useEffect(() => {
    // Handle dropdown visibility
    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isDropdownOpen]);

  useEffect(() => {
    const pusher = new Pusher("ff054817599b88393e16", {
      cluster: "ap2",
    });
  
    const channel = pusher.subscribe("global-messages");
  
    channel.bind("message-received", (data: { conversationId: string; userId: string }) => {
      console.log(
        "conversationId: " +
          data.conversationId +
          " user id: " +
          data.userId +
          " userDe: " +
          userDetails._id
      );
  
      // Update the state with unique conversationId and userId pairs
      setConversationsHadChange((prev) => {
        const newEntry = { conversationId: data.conversationId, userId: data.userId };
  
        // Check if the entry already exists
        const exists = prev.some(
          (item) =>
            item.conversationId === newEntry.conversationId &&
            item.userId === newEntry.userId
        );
  
        if (!exists) {
          const updated = [...prev, newEntry];
          console.log("Updated conversationsHadChange:", updated);
          return updated;
        }
  
        return prev; // Return previous state if entry already exists
      });
    });
  
    return () => {
      channel.unbind_all();
      pusher.unsubscribe("global-messages");
    };
  }, []);
  
  
  const handleCreateConversation = (company: any) => {
    const newConversation = {
      company_id: company._id,
      representative_id: null,
      status: "active",
      company_profilePicture: company.profile_picture,
      company_name: company.businessDisplayName,
      last_use: new Date(),
      user_name: userDetails.name,
      user_profilePicture: "",
    };
    createConversation(newConversation);
    setConversation({ _id: chosenConversationId });
  };

  const handleOptionClick = (company: any) => {
    setSearchTerm("");
    setIsDropdownOpen(false);
    handleCreateConversation(company);
  };

  const handleConversationClick = async (con: Conversation) => {
    if (con._id) {
      console.log("in handleConversationClick" + con._id);
      setConversation({ _id: con._id.toString() });
      setConversationsHadChange((prev) =>
        prev.filter((change) => change.conversationId !== con._id?.toString())
      );
      if (con.status != "active") {
        await statusConversation(con);
      }
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
          style={{ backgroundImage: `url(${company.profile_picture})` }}
        ></div>
        <span className={styles.selectOptionText}>
          {company.businessDisplayName}
        </span>
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
                // setIsDropdownOpen(false);
                setFilteredCompanies(companiesData);
              } else {
                // סינון על בסיס חיפוש
                setFilteredCompanies(
                  companiesData?.filter((company: any) =>
                    company.name
                      ?.toLowerCase()
                      .includes(e.target.value.toLowerCase())
                  )
                );
              }
            }}
            onFocus={() => {
              setIsDropdownOpen(true); // פתיחת התפריט בעת פוקוס
              setFilteredCompanies(companiesData); // הצגת כל החברות כברירת מחדל
            }}
            onKeyDown={handleKeyPress}
          />
          {isDropdownOpen && (
            <div className={styles.selectOptions}>
              <button
                className={styles.closeButton}
                onClick={() => setIsDropdownOpen(false)}
              >
                ✖
              </button>
              <RenderFilteredCompanies />
            </div>
          )}
          {/* {isDropdownOpen && (
            <div className={styles.selectOptions}>
              <RenderFilteredCompanies />
            </div>
          )} */}

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

      <div className={styles.bottom}>
        {userType === "manager" && (
          <div className={styles.settings}>
            <Link href="/manager/representatives">נהול נציגים</Link>
            <FaCog size={18} />
          </div>
        )}
        <p className={styles.yourChatsP}>הצאטים שלך:</p>

        {filteredConversations ? (
          filteredConversations.map((mapConversation: Conversation) => {
            const isSelected =
              conversation._id === mapConversation._id?.toString();
              const isBold = conversationsHadChange.some(
                (change) =>
                  change.conversationId === mapConversation._id?.toString() &&
                  change.userId !== userDetails._id
              );

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
                      : mapConversation.user_profilePicture ||
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_0xOKHJX8XtB036IK2_Ee28dILxTsB_fbWA&s"
                  }
                  alt="Profile"
                />
                <p
                  className={styles.name}
                  style={{ fontWeight: isBold ? "bold" : "normal" }}
                >
                  {userType === "user"
                    ? mapConversation.company_name
                    : mapConversation.user_name
                    ? mapConversation.user_name
                    : "פניה חדשה"}
                </p>
              </div>
            );
          })
        ) : (
          <div className={styles.noResults}>
            {userType === "user"
              ? "אין לך שום פניות :) חפש חברה כדי להתחיל"
              : "אין לך פניות היום :)"}
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
