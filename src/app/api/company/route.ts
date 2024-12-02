"use server"

import { connectDatabase, getSpecificFields } from "@/app/services/mongo";
import { NextResponse } from "next/server";

export async function getNameAndProfile() {
  try {
    const client = await connectDatabase();
    const companies = await getSpecificFields(
      client,
      "comapnies",
      {},
      { _id: 1, name: 1, profilePicture: 1 }
    );
    await client.close();
    console.log(companies);
    return NextResponse.json(companies);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.error();
  }
}
