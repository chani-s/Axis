import { connectDatabase } from "@/app/services/mongo";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { insertDocument } from "@/app/services/mongo";
import Pusher from "pusher";
import jwt from "jsonwebtoken";
import { verifyAuthToken } from "@/app/services/decodeToken";

const secret = process.env.TOKEN_SECRET_KEY;

export async function GET(request:NextRequest) {
  try {

    const authToken = request.cookies.get("authToken")?.value;

    if (!authToken) {
      return new Response("Missing authToken", { status: 401 });
    }

    // Verify token and get userId
    const userId = await verifyAuthToken(authToken);
  
    const client = await connectDatabase();

    try {
      // Fetch all conversations for the given user ID
      const db = client.db("Axis");
      const conversations = await db
        .collection("conversations")
        .find({ user_id: userId })
        .toArray();

      return NextResponse.json(conversations);
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const companyId = url.searchParams.get("company_id") || "";
    const body = await request.json();
    const client = await connectDatabase();
    const db = client.db("Axis");

    const authToken = request.cookies.get("authToken")?.value;

    if (!authToken) {
      return new Response("Missing authToken", { status: 401 });
    }
    if (!secret) {
      return new Response("Missing key", { status: 401 });
    }
    const decodedToken = jwt.verify(authToken, secret) as { userId: string };

    if (!decodedToken || !decodedToken.userId) {
      return new Response("Invalid token", { status: 401 });
    }
    const userId = new ObjectId(decodedToken.userId);
    // Fetch representatives for the specified company
    const representatives = await db
      .collection("users")
      .find({
        user_type: "representative",
        company_id: new ObjectId(companyId),
      })
      .toArray();

    let representativeId = null;

    if (representatives.length > 0) {
      // Find the representative with the minimum number of conversations
      let representativeWithMinConversations = representatives.reduce(
        (minRep, currentRep) => {
          const minLength = minRep.conversations?.length || 0;
          const currentLength = currentRep.conversations?.length || 0;
          return currentLength < minLength ? currentRep : minRep;
        }
      );

      representativeId = representativeWithMinConversations._id;
let result;
      // Update the representative's conversation list
      const conversationId = await db.collection("conversations").insertOne({
        ...body,
        company_id: new ObjectId(companyId),
        user_id: new ObjectId(userId),
        start_time: Date.now(),
        last_use: Date.now(),
        representative_id: representativeId,
      });

      await db.collection("users").updateOne(
        { _id: representativeWithMinConversations._id },
        { $addToSet: { conversations: conversationId.insertedId } } // Add conversation to representative's list
      );
    } else {
      // Create a conversation without assigning a representative
      const result = await db.collection("conversations").insertOne({
        ...body,
        company_id: new ObjectId(companyId),
        user_id: new ObjectId(userId),
        start_time: Date.now(),
        last_use: Date.now(),
        representative_id: null,
      });

      await client.close();
      return NextResponse.json(result);
    }

    await client.close();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}