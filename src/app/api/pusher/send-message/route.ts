import { verifyAuthToken } from "@/app/services/decodeToken";
import { connectDatabase, insertDocument } from "@/app/services/mongo";
import pusher from "@/app/services/pusher";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PUSHER_APP_ID: string;
      PUSHER_KEY: string;
      PUSHER_SECRET: string;
      PUSHER_CLUSTER: string;
    }
  }
}


export async function POST(req: any) {
  try {
    const authToken = req.cookies.get("authToken")?.value;

    if (!authToken) {
      return new Response("Missing authToken", { status: 401 });
    }

    const userId = await verifyAuthToken(authToken);
    const {
      conversationId = "",
      message,
      channel = "chat-channel",
      event = "new-message",
    } = await req.json();

    if (!message) throw new Error("Message is required");

    // Define a unique channel for each conversation
    const conversationChannel = `chat-channel-${conversationId}`;

    const messageData = {
      text: message.text,
      time: message.time,
      sender: userId,
      conversationId,
    };

    console.log(`Broadcasting message to ${conversationChannel}:`, messageData);
    const client = await connectDatabase();
    const result = await insertDocument(client, "massages", messageData);

    await pusher.trigger(conversationChannel, event, messageData);
console.log("save massage"+conversationId)
    await pusher.trigger("global-messages", "message-received", {
      conversationId: conversationId,
      userId:userId
    });
    console.log("save new massage"+conversationId)

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    console.error("Error in POST handler:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
