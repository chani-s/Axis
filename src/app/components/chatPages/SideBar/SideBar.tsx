"use client";
import React, { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./SideBar.module.css";
import ComapnyService from "@/app/services/company";
import { Conversation } from "@/app/models/Conversation";
import { getConversations, createConversation } from "@/app/services/conversation";

const SideBar = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState(""); // State for search term in company search
  const [chatSearchTerm, setChatSearchTerm] = useState(""); // State for search term in chat search
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null); // State for selected company
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to control dropdown visibility
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to hold the timeout ID
  const [isMutating, setIsMutating] = useState(false);
  const [newConversation, setNewConversation] = useState<Conversation>({
    company_id: "",
    user_id: "",
    representative_id: null,
    status_code: 2,
    last_use: new Date(),
    start_time: null,
  });
  const id = "67504b0fbe15427c891d0cbe";

  const { data: conversations, isLoading: isConversationsLoading } = useQuery<
    Conversation[]
  >({
    queryKey: ["conversations"],
    queryFn: () => getConversations(), // Fetch conversations from the server
    staleTime: 10000,
  });
  console.log(conversations);

  const { data: companiesData, refetch: fetchCompanies, isFetching: isCompaniesFetching,
  } = useQuery({
    queryKey: ["companies"],
    queryFn: () => ComapnyService.getNameAndPorfile(),
    enabled: false, // Disable automatic fetching
    staleTime: 10000,
  });

  const handleInputFocus = () => { fetchCompanies() };

  const createConversationMutation = useMutation({
    mutationFn: createConversation,
    onMutate: async (conversation: Conversation) => {
      await queryClient.cancelQueries({ queryKey: ["conversations"] });

      const previousConversations = queryClient.getQueryData(["conversations"])

      return { previousConversations };
    },
    onSuccess: (newConversation) => {
      // After mutation success, replace the old "conversations" with the new data
      queryClient.setQueryData(["conversations"], (old: any) => {
        const updatedConversations = old.map((conversation: any) =>
          conversation._id === newConversation._id ? newConversation : conversation
        );
        return updatedConversations;
      });

      // Optionally, invalidate queries if you need to refetch fresh data from the server
    }
  });

  const handleCreateCar = (company: any) => {
    createConversationMutation.mutate(newConversation);
    setNewConversation({
      company_id: company._id,
      user_id: id,
      representative_id: null,
      status_code: 2,
    });
  };

  const resetDropdownTimeout = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }

    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 3000);
  };

  const filteredCompanies =
    companiesData?.filter((company: any) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const filteredConversations =
    conversations?.filter((conversation: Conversation) => {
      return conversation.company_name || ""
        .toLowerCase()
        .includes(chatSearchTerm.toLowerCase());
    }) || [];

  const handleOptionClick = (company: any) => {
    setSelectedCompany(company.name);
    setSearchTerm(company.name);
    setIsDropdownOpen(false);
    handleCreateCar(company)
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
            handleInputFocus();
            setIsDropdownOpen(true);
            resetDropdownTimeout();
          }}
        />
        {isDropdownOpen && (
          <div className={styles.selectOptions}>
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company: any) => (
                <div
                  key={company._id}
                  className={styles.optionItem}
                  onClick={() => handleOptionClick(company)}
                >
                  <div
                    className={styles.profileCircle}
                    style={{
                      backgroundImage: `url(${company.profilePicture})`,
                    }}
                  ></div>
                  <span className={styles.selectOptionText}>
                    {company.name}
                  </span>
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
        {filteredConversations ? (
          filteredConversations.map((conversation) => {
            return (
              <div
                className={styles.conversationItem}
                key={conversation._id?.toString()}
              >
                <img
                  className={styles.profileCircle}
                  src={conversation.company_profilePicture} // Use the company image
                  alt="Profile"
                />
                <p className={styles.name}>{conversation.company_name}</p>{" "}
                {/* Display company name */}
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
