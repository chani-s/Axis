"use client";
import { useEffect, useState } from "react";
import MainPage from "../../components/chatPages/MainPage/MainPage";
import { getConversations, getRepConversations } from "@/app/services/conversation";
import { Conversation } from "@/app/models/Conversation";
import { useQuery } from "@tanstack/react-query";


const Page = () => {

    const { data: repConversation } = useQuery<Conversation[]>({
        queryKey: ["repConversation"],
        queryFn: () => getRepConversations(),
        staleTime: 10000,
      });
    return (
        <MainPage
        type="manager"
        conversations={repConversation || []}
        companiesData={[]}
        createConversation={null}
        chosenConversationId={""}
      />
    );
};

export default Page;