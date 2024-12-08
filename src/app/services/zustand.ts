
import {create} from 'zustand';
import { ObjectId } from 'mongodb';

type UserStore = {
    userDetails: object;
    setUserDetails: (details: object) => void; 
};

export const userDetailsStore = create<UserStore>((set) => ({
    userDetails: {},

    setUserDetails: (details: object): void => set({ userDetails : details }),
}));
