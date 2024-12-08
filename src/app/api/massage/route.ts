import { Message } from "@/app/models/Message";
import { connectDatabase, getById } from "@/app/services/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

// Dummy data; replace with a database integration

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { conversationId } = req.query;
  let id;
  if (conversationId) {
    id = conversationId?.toString();
  }
  if (id) {
    try {
      const client = await connectDatabase();
      const result = await getById(client, "massages", id);
      await client.close();
      console.log(result);
      return NextResponse.json(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
