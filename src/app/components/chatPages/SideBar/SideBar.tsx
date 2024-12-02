"use client"
import React, { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import styles from "./SideBar.module.css"

const SideBar = () => {
  const queryClient = useQueryClient();

  const [conversations, setConversations] = useState([
    { id: 6, name: "Company A", image: "/imgs/default_profile_picture.jpg" },
    { id: 2, name: "Company B", image: "/imgs/default_profile_picture.jpg" },
    { id: 3, name: "Company C", image: "/imgs/default_profile_picture.jpg" },
    { id: 8, name: "Company D", image: "/imgs/default_profile_picture.jpg" },
    { id: 5, name: "Company E", image: "/imgs/default_profile_picture.jpg" },
  ]); // Initialize with some conversations

  // Mock companies with images for the dropdown options
  const companies = [
    { id: 1, name: "Company A", image: "/imgs/default_profile_picture.jpg" },
    { id: 2, name: "Company B", image: "/imgs/default_profile_picture.jpg" },
    { id: 3, name: "Company C", image: "/imgs/default_profile_picture.jpg" },
    { id: 4, name: "Company D", image: "/imgs/default_profile_picture.jpg" },
    { id: 5, name: "Company E", image: "/imgs/default_profile_picture.jpg" },
  ];

  const [searchTerm, setSearchTerm] = useState(""); // State for search term in company search
  const [chatSearchTerm, setChatSearchTerm] = useState(""); // State for search term in chat search
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null); // State for selected company
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to control dropdown visibility
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to hold the timeout ID

  
  const resetDropdownTimeout = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current); // Clear any existing timeout
    }

    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false); // Close dropdown after 3 seconds
    }, 3000); // 3 seconds delay
  };

  // Filter companies based on search term
  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter conversations based on chat search term
  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(chatSearchTerm.toLowerCase()) // Filter based on company name
  );

  const handleOptionClick = (company: { id: number; name: string; image: string }) => {
    // Prevent adding a duplicate conversation
    const isDuplicate = conversations.some(conversation => conversation.id === company.id);
    if (isDuplicate) {
      return; // Prevent adding a duplicate conversation
    }

    setSelectedCompany(company.name); // Set selected company
    setSearchTerm(company.name); // Update input with selected company name
    setIsDropdownOpen(false); // Close dropdown after selecting an option

    // Add new conversation item with the selected company details (immutable update)
    setConversations((prevConversations) => [
      ...prevConversations, // Spread previous conversations
      { id: company.id, name: company.name, image: company.image }, // Add new conversation
    ]);
  };

  return (
    <div className={styles.sideBar}>
      <div className={styles.inputs}>
        <input
          className={styles.input}
          type="text"
          placeholder="חפש חברה חדשה..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true);
            resetDropdownTimeout(); // Open dropdown when typing
          }}
          onFocus={() => {
            setIsDropdownOpen(true);
            resetDropdownTimeout(); // Open dropdown when focused
          }}
        />
        {isDropdownOpen && (
          <div className={styles.selectOptions}>
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  className={styles.optionItem}
                  onClick={() => handleOptionClick(company)} // Handle option click
                >
                  <div
                    className={styles.profileCircle}
                    style={{ backgroundImage: `url(${company.image})` }}
                  ></div>
                  <span className={styles.selectOptionText}>{company.name}</span>
                </div>
              ))
            ) : (
              <div className={styles.noResults}>לא נמצאו תוצאות</div>
            )}
          </div>
        )}
        <input
          className={styles.input}
          type="text"
          placeholder="חפש בצאטים..."
          value={chatSearchTerm}
          onChange={(e) => setChatSearchTerm(e.target.value)} // Update search term for chats
        />
      </div>

      <p className={styles.yourChatsP}>הצאטים שלך:</p>
      <div className={styles.bottom}>
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <div className={styles.conversationItem} key={conversation.id}>
              <img
                className={styles.profileCircle}
                src={conversation.image} // Use the company image
                alt="Profile"
              />
              <p className={styles.name}>{conversation.name}</p> {/* Display company name */}
            </div>
          ))
        ) : (
          <div className={styles.noResults}>לא נמצאו תוצאות</div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
