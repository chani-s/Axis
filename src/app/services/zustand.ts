import {create} from 'zustand';
import { ObjectId } from 'mongodb';

interface User{
    _id: string;
    email: string;
    google_auth: boolean;
    user_type: string;
  }

  interface Conversation{
    _id: string;
  }

  interface Conversation{
    _id: string;
  }

type UserStore = {
    userDetails: User;
    setUserDetails: (details: User) => void; 
};

export const userDetailsStore = create<UserStore>((set) => ({
    userDetails: { _id: "", email: "", google_auth: false, user_type: "",},
    setUserDetails: (details: User) => set({ userDetails : details }),
}));

type Conversations = {
    conversation: Conversation;
    setConversation: (details: Conversation) => void; 
};

export const conversationsStore = create<Conversations>((set) => ({
    conversation: { _id: ""},
    setConversation: (details: Conversation) => set({ conversation : details }),
}));
