"use client";

import { ObjectId } from "mongodb";

export interface Message{
    _id: ObjectId;
    message: string;
    sender_id: ObjectId;
    reciver_id: ObjectId;
    conversation_id: ObjectId;
    sending_time: Date;
    isRead: boolean;

}