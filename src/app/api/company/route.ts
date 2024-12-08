import { connectDatabase, getSpecificFields } from "@/app/services/mongo";
import { log } from "console";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    // Connect to the database
    const client = await connectDatabase();
    let result;
    switch (type) {
      case "nameAndProfile":
        result = await getSpecificFields(client, "companies", {}, { _id: 1, name: 1, profilePicture: 1 });
        break;
    }
    await client.close();
    console.log(result)
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

