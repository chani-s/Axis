"use client";

import { ObjectId } from "mongodb";

export interface Conversation {
    _id: ObjectId;
    company_id: ObjectId;
    company_name: string;
    company_profilePicture: string;
    user_id: ObjectId;
    representative_id: ObjectId | null;
    status_code: number;
    last_use: Date | null;
    start_time: Date | null;
  }