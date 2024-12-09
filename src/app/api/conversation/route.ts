import { connectDatabase } from "@/app/services/mongo";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { insertDocument } from "@/app/services/mongo";

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
    await client.close();
    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
export async function POST(request: Request) {
    try {
      const url = new URL(request.url);
      const companyId = url.searchParams.get("company_id")||""; 
      const userId = url.searchParams.get("user_id")||""; 
      const body = await request.json();

      const client = await connectDatabase();
      
      const db = client.db("Axis");
      console.log(companyId);
    
      const result = await insertDocument(client, "conversations", {
        ...body,
        company_id: new ObjectId(companyId), 
        user_id: new ObjectId(userId), 
        start_time:  Date.now(),
        last_use: Date.now(),
      });

      await client.close();

      return NextResponse.json(result);
    } catch (error) {
      console.error("Error creating conversation:", error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  }
