
import {create} from 'zustand';
import { ObjectId } from 'mongodb';

interface User{
    _id: string;
    email: string;
    google_auth: boolean;
  }

type UserStore = {
    userDetails: User;
    setUserDetails: (details: User) => void; 
};

export const userDetailsStore = create<UserStore>((set) => ({
    userDetails: { _id: "", email: "", google_auth: false},
    setUserDetails: (details: User) => set({ userDetails : details }),
}));
