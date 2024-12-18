import { create } from "zustand";
import { ObjectId } from "mongodb";

interface User {
    _id: string;
    email: string;
    google_auth: boolean;
    user_type: string;
    user_name: string;
    id_number: string | null;
    address: string | null;

}

interface Conversation {
    _id: string;
}

type UserStore = {
    userDetails: User;
    setUserDetails: (details: User) => void;
    getMissingDetails: () => string[];  // פונקציה לקבלת השדות החסרים
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
        user_name: "",
        id_number: null,
        address: null,
    },
    setUserDetails: (details: User) => set({ userDetails: details }),

    getMissingDetails: () => {
        const missing: string[] = [];
        const userDetails = userDetailsStore.getState().userDetails;

        if (!userDetails.user_name) missing.push("user_name");
        if (!userDetails.id_number) missing.push("id_number");
        if (!userDetails.address) missing.push("address");
        console.log(missing);
        return missing;
    },
}));

export const conversationsStore = create<Conversations>((set) => ({
    conversation: { _id: "" },
    setConversation: (details: Conversation) => set({ conversation: details }),
}));
