"use client";
import { useCallback, useState } from "react";
import MainPage from "../../components/chatPages/MainPage/MainPage";
import { Conversation } from "@/app/models/Conversation";
import { createConversation, getConversations } from "@/app/services/conversation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CompanyService from "@/app/services/company";

const Page = () => {

    const[chosenConversationId,setChosenConversationId]=useState("")
  const queryClient = useQueryClient();

  const { data: conversations, isLoading: isConversationsLoading } = useQuery<
    Conversation[]
  >({
    queryKey: ["conversations"],
    queryFn: () => getConversations(),
    staleTime: 10000,
  });

  const { data: companiesData } = useQuery({
    queryKey: ["companies", conversations],
    queryFn: async () => {
      if (!conversations) return []; // Ensure conversations are loaded
      const companyIds = conversations.map((c) => c.company_id.toString());
      return CompanyService.getNameAndProfile(companyIds);
    },
    staleTime: 100000,
    enabled: !!conversations, // Only run query if conversations are loaded
  });

  const createConversationMutation = useMutation({
    mutationFn: createConversation,
    onMutate: async (conversation: any) => {
      await queryClient.cancelQueries({ queryKey: ["conversations"] });
      const previousConversations = queryClient.getQueryData(["conversations"]);
      queryClient.setQueryData(["conversations"], (old: any) => [
        ...(old || []),
        conversation,
      ]);
      return { previousConversations };
    },
    onSuccess: (newConversation) => {
      queryClient.setQueryData(["conversations"], (old: any) => {
        return old.map((conversation: any) =>
          conversation.company_name === newConversation.company_name
            ? newConversation
            : conversation
        );
      });
      setChosenConversationId(newConversation._id.toString());

    },
  });

  const createConv = useCallback(
    (conversation: Conversation) => {
    console.log("in create conv");
    
      createConversationMutation.mutate(conversation);
    },
    [createConversationMutation]
  );

  return (
    <div>
      <MainPage
        type="user"
        conversations={conversations || []}
        companiesData={companiesData || []}
        createConversation={createConv}
        chosenConversation={chosenConversationId}
      />
    </div>
  );
};

export default Page;
