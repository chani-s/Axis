"use client";
import { Conversation } from "./Conversation";

import { ObjectId } from "mongodb";

export interface Representative {
    _id: ObjectId;
    email: string;
    name: string;
    profile_picture: string;
    conversations: Conversation[];
}