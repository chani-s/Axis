import { connectDatabase, getSpecificFields } from "@/app/services/mongo";
import { MongoClient, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:Request) {
  try {
    const urlParams = new URL(req.url).searchParams;
    const conversationId = urlParams.get("conversationId");
    if(!conversationId){
        throw new Error("no convesation choose");
    }
    console.log(conversationId);
    const objectConversation=new ObjectId(conversationId);
    const client = await connectDatabase();


    if (!conversationId) {
      return new Response("Conversation ID is required", { status: 400 });
    }


    // Query messages by conversationId
    const messages = await getSpecificFields(client,"massages",{conversationId:conversationId},{},);
    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.error("Failed to retrieve messages:", error);
    return new Response(JSON.stringify({ success: false, error: error }), { status: 500 });
  }
}

