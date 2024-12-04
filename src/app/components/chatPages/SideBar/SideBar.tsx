"use client";
import React, { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styles from "./SideBar.module.css";
import ComapnyService from "@/app/services/company";
import { Conversation } from "@/app/models/Conversation";
import ConversationService from "@/app/services/conversation";
import { ObjectId } from "mongodb";

const SideBar = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState(""); // State for search term in company search
  const [chatSearchTerm, setChatSearchTerm] = useState(""); // State for search term in chat search
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null); // State for selected company
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to control dropdown visibility
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref to hold the timeout ID
  const [isMutating, setIsMutating] = useState(false);
  const [newConversation, setNewConversation] = useState<Conversation>({
    _id: new ObjectId(),
    company_id: new ObjectId(),
    company_name: "",
    company_profilePicture: "",
    user_id: new ObjectId(),
    representative_id: null,
    status_code: 2,
    last_use: new Date(),
    start_time: null,
  });
  const id = new ObjectId("67504b0fbe15427c891d0cbe");

  const { data: conversations, isLoading: isConversationsLoading } = useQuery<
    Conversation[]
  >({
    queryKey: ["conversations"],
    queryFn: () => ConversationService.getConversations(), // Fetch conversations from the server
    staleTime: 10000,
  });
  console.log(conversations);

  const {
    data: companiesData,
    refetch: fetchCompanies,
    isFetching: isCompaniesFetching,
  } = useQuery({
    queryKey: ["companies"],
    queryFn: () => ComapnyService.getNameAndPorfile(),
    enabled: false, // Disable automatic fetching
    staleTime: 10000,
  });
  const handleInputFocus = () => {
    fetchCompanies();
  };

  const createConversationMutation = useMutation({
    mutationFn: ConversationService.createConversation,
    onMutate: async (conversation: Conversation) => {
      setIsMutating(true);
      await queryClient.cancelQueries({ queryKey: ["conversations"] });
      const previousCars = queryClient.getQueryData(["conversations"]);
      queryClient.setQueryData(["conversations"], (old: any) => [
        ...old,
        conversation,
      ]);
      return { previousCars };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setIsMutating(false);
    },
  });
  const handleCreateCar = (company: any) => {
    createConversationMutation.mutate(newConversation);
    setNewConversation({});
  };

  const resetDropdownTimeout = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current); // Clear any existing timeout
    }

    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false); // Close dropdown after 3 seconds
    }, 3000); // 3 seconds delay
  };

  // Filter companies based on search term
  const filteredCompanies =
    companiesData?.filter((company: any) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Filter conversations based on chat search term
  const filteredConversations =
    conversations?.filter((conversation: Conversation) => {
      return conversation.company_name
        .toLowerCase()
        .includes(chatSearchTerm.toLowerCase());
    }) || [];

  const handleOptionClick = (company: {
    id: number;
    name: string;
    image: string;
  }) => {
    // Prevent adding a duplicate conversation
    if (conversations) {
      const isDuplicate = conversations.some(
        (conversation: any) =>
          conversation.company_id?.toString() === company.id.toString()
      );
      if (isDuplicate) {
        return; // Prevent adding a duplicate conversation
      }
    }

    setSelectedCompany(company.name); // Set selected company
    setSearchTerm(company.name); // Update input with selected company name
    setIsDropdownOpen(false); // Close dropdown after selecting an option

    // Add new conversation item with the selected company details (immutable update)
    // setConversations((prevConversations) => [
    //   ...prevConversations, // Spread previous conversations
    //   { id: company.id, name: company.name, image: company.image, company_id: company.id.toString() }, // Add new conversation with company_id as string
    // ]);
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
            handleInputFocus();
            setIsDropdownOpen(true);
            resetDropdownTimeout(); // Open dropdown when focused
          }}
        />
        {isDropdownOpen && (
          <div className={styles.selectOptions}>
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company: any) => (
                <div
                  key={company.id}
                  className={styles.optionItem}
                  onClick={() => handleOptionClick(company)} // Handle option click
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
          onChange={(e) => setChatSearchTerm(e.target.value)} // Update search term for chats
        />
      </div>

      <p className={styles.yourChatsP}>הצאטים שלך:</p>
      <div className={styles.bottom}>
        {filteredConversations ? (
          filteredConversations.map((conversation) => {
            return (
              <div
                className={styles.conversationItem}
                key={conversation._id.toString()}
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
