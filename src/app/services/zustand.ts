import { create } from "zustand";

interface User {
    _id: string;
    email: string;
    google_auth: boolean;
    user_type: string;
    name: string;
    id_number: string | null;
    address: string | null;
    status: string | null;
    profile_picture: string | null;


}

interface Conversation {
    _id: string;
}

type UserStore = {
    userDetails: User;
    setUserDetails: (details: User) => void;
    getMissingDetails: () => string[];  
};

type Conversations = {
    conversation: Conversation;
    setConversation: (details: Conversation) => void;
};

export const userDetailsStore = create<UserStore>((set) => ({
    userDetails: {
        _id: "",
        email: "",
        google_auth: false,
        user_type: "",
        name: "",
        id_number: null,
        address: null,
        status: null,
        id_number: "",
        address: "",
        profile_picture: "",
    },
    setUserDetails: (details: User) => set({ userDetails: details }),

    getMissingDetails: () => {
        const missing: string[] = [];
        const userDetails = userDetailsStore.getState().userDetails;

        if (!userDetails.name) missing.push("name");
        if (!userDetails.id_number) missing.push("id_number");
        if (!userDetails.address) missing.push("address");
        return missing;
    },
}));

export const conversationsStore = create<Conversations>((set) => ({
    conversation: { _id: "" },
    setConversation: (details: Conversation) => set({ conversation: details }),
}));
