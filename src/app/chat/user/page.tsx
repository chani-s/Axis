"use client";
import { useEffect, useState } from "react";
import MainPage from "../../components/chatPages/MainPage/MainPage";
import { Conversation } from "@/app/models/Conversation";
import { createConversation, getConversations } from "@/app/services/conversation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CompanyService from "@/app/services/company";


const Page = () => {
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
        // Chanis Changes:
        const conversationId = {
          _id: newConversation._id,
        };
        

        return updatedConversations;
      });
    },
  });
    return (
        <div>
            <MainPage type="user"/>
        </div>
    );
};

export default Page;