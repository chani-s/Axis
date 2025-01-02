import { connectDatabase, getSpecificFields } from "@/app/services/mongo";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Parse URL parameters
    const urlParams = new URL(req.url).searchParams;
    const conversationId = urlParams.get("conversationId");

    // Validate conversationId
    if (!conversationId) {
      return new Response("Conversation ID is required", { status: 400 });
    }

    // Connect to the database
    const client = await connectDatabase();

    // Define a flexible filter type

    // Query the database for messages
    const messages = await getSpecificFields(client, "massages", {}, {});

    // Return the response
    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.error("Failed to retrieve messages:", error);

    // Return error response
    return new Response(JSON.stringify({ success: false, error }), {
      status: 500,
    });
  }
}
