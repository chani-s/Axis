import Pusher from "pusher";

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

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
});


export async function POST(req: any) {
    try {
        const { channel = "chat-channel", event = "new-message", message } = await req.json();
        if (!message) throw new Error("Message is required");
        await pusher.trigger(channel, event, message);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error: any) {
        console.error("Error in POST handler:", error);
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
}

