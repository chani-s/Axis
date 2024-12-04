import { connectDatabase } from "@/app/services/mongo";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    console.log("Connecting to database...");
    const client = await connectDatabase();
    const db = client.db("Axis");

    console.log("Running aggregation pipeline...");
    const conversations = await db.collection("conversations").aggregate([
      {
        $lookup: {
          from: "companies", // Match companies collection
          localField: "company_id", // Field in conversations
          foreignField: "_id", // Field in companies
          as: "companyDetails", // Output alias
        },
      },
      {
        $unwind: {
          path: "$companyDetails", // Flatten companyDetails array
          preserveNullAndEmptyArrays: false, // Ensure only matched documents are returned
        },
      },
      {
        $project: {
          _id: 1,
          company_id: 1,
          company_name: "$companyDetails.name", // Extract company name
          company_profilePicture: "$companyDetails.profilePicture", // Extract profile picture
          user_id: 1,
          representative_id: 1,
          status: 1,
          last_use: 1,
          start_time: 1,
        },
      },
    ]).toArray();

    console.log("Aggregation result:", conversations);

    await client.close();
    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
export async function POST(request: Request) {
    try {
      const client = await connectDatabase();
      const db = client.db("Axis");
  
      const newConversation = await request.json();
  
      const result = await db.collection("conversations").insertOne({
        ...newConversation,
        start_time: new Date(),
        last_use: new Date(), 
      });
  
      console.log("Conversation created:", result);
  
      await client.close();
  
      return NextResponse.json({
        message: "Conversation created successfully",
        conversation: result, 
      });
    } catch (error) {
      console.error("Error creating conversation:", error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  }
