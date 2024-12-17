"use client";

import { ObjectId } from "mongodb";

export interface Conversation {
    _id?: ObjectId;
    company_id: ObjectId|string;
    company_name: string;
    company_profilePicture?: string;
    user_id: ObjectId|string;
    user_name: string;
    user_profilePicture?: string;
    representative_id: ObjectId | null;
    status_code: number;
    last_use?: Date | null;
    start_time?: Date | null;
  }