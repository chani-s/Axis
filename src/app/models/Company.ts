"use client";

import { ObjectId } from "mongodb";

export interface Company{
    _id: ObjectId;
    is_approved: string;
    email: string;
    exposed_details: string[];
    official_name: string;
    show_name: string;
    file_one: string;
    file_two: string;
}
