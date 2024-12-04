"use client"
import React, { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./SideBar.module.css"
import ComapnyService from "@/app/services/company";

const SideBar = () => {
  const queryClient = useQueryClient();

  const [conversations, setConversations] = useState([
    { id: 6, name: "מאוחדת", image: "/imgs/default_profile_picture.jpg" },
    { id: 2, name: "כללית", image: "/imgs/default_profile_picture.jpg" },
    { id: 3, name: "לאומית", image: "/imgs/default_profile_picture.jpg" },
    { id: 8, name: "מכבי", image: "/imgs/default_profile_picture.jpg" },
    { id: 5, name: "בנק", image: "/imgs/default_profile_picture.jpg" },
  ]); 


  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["companies"],
    queryFn: ComapnyService.getNameAndPorfile,
    staleTime: 10000,
  });


  const [searchTerm, setSearchTerm] = useState(""); 
  const [chatSearchTerm, setChatSearchTerm] = useState(""); 
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null); 

  
  const resetDropdownTimeout = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current); 
    }

    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 3000); 
  };

  const filteredCompanies = data?.filter((company: any) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(chatSearchTerm.toLowerCase()) 
  );

  const handleOptionClick = (company: { id: number; name: string; image: string }) => {
    const isDuplicate = conversations.some(conversation => conversation.id === company.id);
    if (isDuplicate) {
      return; 
    }

    setSelectedCompany(company.name);
    setSearchTerm(company.name);
    setIsDropdownOpen(false); 

    setConversations((prevConversations) => [
      ...prevConversations, 
      { id: company.id, name: company.name, image: company.image }, 
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
            resetDropdownTimeout(); 
          }}
          onFocus={() => {
            setIsDropdownOpen(true);
            resetDropdownTimeout(); 
          }}
        />
        {isDropdownOpen && (
          <div className={styles.selectOptions}>
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company:any) => (
                <div
                  key={company.id}
                  className={styles.optionItem}
                  onClick={() => handleOptionClick(company)}
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
          onChange={(e) => setChatSearchTerm(e.target.value)} 
        />
      </div>

      <p className={styles.yourChatsP}>הצאטים שלך:</p>
      <div className={styles.bottom}>
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <div className={styles.conversationItem} key={conversation.id}>
              <img
                className={styles.profileCircle}
                src={conversation.image} 
                alt="Profile"
              />
              <p className={styles.name}>{conversation.name}</p> 
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
