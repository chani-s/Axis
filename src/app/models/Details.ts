"use client"

import { ObjectId } from "mongodb";

export interface Details {
    _id: ObjectId;
    user_id: ObjectId;
    detail_type_id: ObjectId;
    content: string; // The access type

}