"use client";

import { ObjectId } from "mongodb";

export interface Conversation{
    _id: ObjectId;
    company_id: ObjectId;
    user_id: ObjectId;
    representative_id: ObjectId;
    status: string;
    last_use: Date;
    start_time: Date;
}