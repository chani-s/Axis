"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./SideBar.module.css";
import ComapnyService from "@/app/services/company";
import { Conversation } from "@/app/models/Conversation";
import {
  getConversations,
  createConversation,
} from "@/app/services/conversation";
import CompanyService from "@/app/services/company";
import { conversationsStore } from "../../../services/zustand";

const SideBar = () => {
  const id = "67504b0fbe15427c891d0cbe";

  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState(""); // State for search term in company search
  const [chatSearchTerm, setChatSearchTerm] = useState(""); // State for search term in chat search
  const [selectedConversationId, setselectedConversationId] = useState<
    string | null
  >(null); // State for selected company
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to control dropdown visibility
  const [newConversation, setNewConversation] = useState<Conversation>({
    company_id: "",
    company_name: "",
    user_id: id,
    representative_id: null,
    status_code: 2,
    last_use: new Date(),
    start_time: null,
  });

  const conversation = conversationsStore((state) => state.conversation);
  const setConversation = conversationsStore((state) => state.setConversation);

  const { data: conversations, isLoading: isConversationsLoading } = useQuery<
    Conversation[]
  >({
    queryKey: ["conversations"],
    queryFn: () => getConversations(),
    staleTime: 10000,
  });
  const { data: companiesData } = useQuery({
    queryKey: ["companies", conversations],
    queryFn: () => {
      let companyIds = [];
      // Ensure conversations are loaded before extracting company IDs
      if (!conversations) return Promise.resolve([]);
      companyIds = conversations.map(
        (conversation) => conversation.company_id.toString() // Convert ObjectId to string
      );
      return CompanyService.getNameAndProfile(companyIds);
    },
    staleTime: 100000,
    enabled: !!conversations, // Only run this query if conversations are loaded
  });
  let filteredConversations = conversations;

  const createConversationMutation = useMutation({
    mutationFn: createConversation,
    onMutate: async (conversation: any) => {
      await queryClient.cancelQueries({ queryKey: ["conversations"] });
      const previousConversations = queryClient.getQueryData(["conversations"]);
      queryClient.setQueryData(["conversations"], (old: any) => [
        ...old,
        conversation,
      ]);
      return { previousConversations };
    },
    onSuccess: (newConversation) => {
      queryClient.setQueryData(["conversations"], (old: any) => {
        const updatedConversations = old.map((conversation: any) =>
          conversation.company_name === newConversation.company_name
            ? newConversation
            : conversation
        );
        filteredConversations = conversations;
        setselectedConversationId(newConversation._id); // Unneccessary?
        // Chanis Changes:
        const conversationId = {
          _id: newConversation._id,
        };
        setConversation(conversationId);
        console.log("zustand: " + conversation);

        return updatedConversations;
      });
    },
  });

  const inputsRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = (e: MouseEvent) => {
    if (inputsRef.current && !inputsRef.current.contains(e.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
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
      user_id: id,
      representative_id: null,
      status_code: 2,
      company_profilePicture: company.profilePicture,
      company_name: company.name,
      last_use: new Date(),
    };

    setNewConversation(newConversation);
    createConversationMutation.mutate(newConversation);
  };

  const filteredCompanies =
    companiesData?.filter((company: any) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  filteredConversations =
    conversations?.filter((conversation: any) => {
      return (conversation.company_name?.toLowerCase() || "").includes(
        chatSearchTerm.toLowerCase()
      );
    }) || [];

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

  const handleOptionClick = (company: any) => {
    setSearchTerm(company.name);
    setIsDropdownOpen(false);
    handleCreateConversation(company);
  };
  const handleConversationClick = (con: Conversation) => {
    if (con._id) {
      setselectedConversationId(con._id.toString());
      const conversationId = {
        _id: con._id.toString(),
      };
      setConversation(conversationId);
      console.log("zustand: " + conversation._id);
    }
  };

  return (
    <div className={styles.sideBar}>
      <div ref={inputsRef} className={styles.inputs}>
        <input
          className={styles.input}
          type="text"
          placeholder="חפש חברה חדשה..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => {
            // handleInputFocus();
            setIsDropdownOpen(true);
          }}
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
                  src={mapConversation.company_profilePicture}
                  alt="Profile"
                />
                <p className={styles.name}>{mapConversation.company_name}</p>
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
