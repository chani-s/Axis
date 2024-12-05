
import {create} from 'zustand';
import { ObjectId } from 'mongodb';

type ObjectIdStore = {
    objectId: ObjectId[];
    setObjectIds: (ids: ObjectId[]) => void; 
};

export const useObjectIdStore = create<ObjectIdStore>((set) => ({
    objectId: [],

    setObjectIds: (ids: ObjectId[]): void => set({ objectId: ids }),
}));
