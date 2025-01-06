export const dynamic = "force-dynamic";

import { connectDatabase, getSpecificFields } from "@/app/services/mongo";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { insertDocument } from "@/app/services/mongo";
import jwt from "jsonwebtoken";
import { verifyAuthToken } from "@/app/services/decodeToken";
const secret = process.env.TOKEN_SECRET_KEY;

export async function GET(request: NextRequest) {
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
    const activate = url.searchParams.get("activate") || "";
    const conversationId = url.searchParams.get("conversationId") || "";

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
    console.log(userId + "userID");

    // Fetch representatives for the specified company
    const representatives = await getSpecificFields(
      client,
      "users",
      { user_type: "representative", companyId: companyId },
      {}
    );
    
    console.log(representatives + "representatives for company");

    let representativeId: string | null = null;
    let result;

    if (representatives.length > 0) {
      console.log(representatives + "representatives for company");

      // Find the representative with the minimum number of conversations
      let representativeWithMinConversations = representatives.reduce(
        (minRep, currentRep) => {
          const minLength = minRep.conversations || 0;
          const currentLength = currentRep.conversations || 0;
          return currentLength < minLength ? currentRep : minRep;
        }
      );

      console.log(
        representativeWithMinConversations +
          "representativeWithMinConversations"
      );

      representativeId = representativeWithMinConversations._id.toString();
      if (activate == "false") {
        result = await insertDocument(client, "conversations", {
          ...body,
          company_id: new ObjectId(companyId),
          user_id: new ObjectId(userId),
          start_time: Date.now(),
          last_use: Date.now(),
          representative_id: new ObjectId(representativeId),
        });
        if (!result || !result._id) {
          return NextResponse.json({ message: "prob with id" });
        }
      } else {
        const updateConversationResult = await db
          .collection("conversations")
          .updateOne(
            { _id: new ObjectId(conversationId) },
            {
              $set: {
                status: "active",
                representative_id: new ObjectId(representativeId),
              },
            }
          );
      }

      await db.collection("users").updateOne(
        { _id: representativeWithMinConversations._id },
        { $inc: { conversations: 1 } } // Increment the conversations count by 1
      );
    } else {
      // Create a conversation without assigning a representative
      result = await insertDocument(client, "conversations", {
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

export async function PUT(request: NextRequest) {
  const url = new URL(request.url);
  const conversationId = url.searchParams.get("conversationId") || "";

  if (!conversationId) {
    return NextResponse.json(
      { error: "No conversation id provided" },
      { status: 400 }
    );
  }
  // Connect to the database
  const client = await connectDatabase();
  const db = client.db("Axis"); // Replace with your da
  const updateConversationResult = await db
    .collection("conversations")
    .updateOne(
      { _id: new ObjectId(conversationId) },
      { $set: { status: "active" } }
    );
  return NextResponse.json({ message: "Conversation updated successfully" });
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const conversationId = url.searchParams.get("conversationId") || "";

    if (!conversationId) {
      return NextResponse.json(
        { error: "No conversation id provided" },
        { status: 400 }
      );
    }

    // Connect to the database
    const client = await connectDatabase();
    const db = client.db("Axis"); // Replace with your database name

    // Get the representative ID from the conversation
    const conversation = await db
      .collection("conversations")
      .findOne({ _id: new ObjectId(conversationId) });

    if (!conversation || !conversation.representative_id) {
      return NextResponse.json(
        { error: "Conversation or representative not found " },
        { status: 404 }
      );
    }

    let representativeId = "";

    representativeId = conversation.representative_id;

    // Set the representative field to null in the conversation
    const updateConversationResult = await db
      .collection("conversations")
      .updateOne(
        { _id: new ObjectId(conversationId) },
        { $set: { representative_id: null, status: "notActive" } }
      );

    if (updateConversationResult.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to update the conversation" },
        { status: 500 }
      );
    }

    if (!representativeId) {
      return NextResponse.json(
        { error: "representative not found" },
        { status: 404 }
      );
    }
    // Decrement the conversations count for the representative
    const updateRepresentativeResult = await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(representativeId) },
        { $inc: { conversations: -1 } }
      );

    if (updateRepresentativeResult.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to update the representative's conversations count" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Conversation removed successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error my" },
      { status: 500 }
    );
  }
}
