import React, { useState } from "react";
import { Conversation } from "@/app/models/Conversation";
import styles from "./SideBar.module.css";

const SideBar = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]); // Initialize as an empty array
  const arr = [1, 2, 3, 4, 5];

  // Mock companies with images for the dropdown options
  const companies = [
    { id: 1, name: "Company A", image: "/imgs/default_profile_picture.jpg" },
    { id: 2, name: "Company B", image: "/imgs/default_profile_picture.jpg" },
    { id: 3, name: "Company C", image: "/imgs/default_profile_picture.jpg" },
    { id: 4, name: "Company D", image: "/imgs/default_profile_picture.jpg" },
    { id: 5, name: "Company E", image: "/imgs/default_profile_picture.jpg" },
  ];

  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null); // State for selected company
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to control dropdown visibility

  // Filter companies based on search term
  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionClick = (companyName: string) => {
    setSelectedCompany(companyName); // Set selected company
    setSearchTerm(companyName); // Update input with selected company name
    setIsDropdownOpen(false); // Close dropdown after selecting an option
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
            setIsDropdownOpen(true); // Open dropdown when typing
          }}
        />
        {isDropdownOpen && searchTerm && (
          <div className={styles.selectOptions}>
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  className={styles.optionItem}
                  onClick={() => handleOptionClick(company.name)} // Handle option click
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
        />
      </div>
      <p className={styles.yourChatsP}>הצאטים שלך:</p>
      <div className={styles.bottom}>
        {arr.map((c, index) => (
          <div className={styles.conversationItem} key={index}>
            <img
              className={styles.profileCircle}
              src="/imgs/default_profile_picture.jpg" // Path to default profile image
            />
            <p className={styles.name}>comapny</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
