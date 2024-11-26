"use client";

import { ObjectId } from "mongodb";

export interface User{
    _id: ObjectId;
    googleAuth: boolean;
    email: string;
    googleId: string;
    user_type: string;
    profile_picture: string;
    name: string;
}