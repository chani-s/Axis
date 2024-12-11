import { connectDatabase, getDocumentsByIds, getSpecificFields } from "@/app/services/mongo";
import { log } from "console";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const idsParam = searchParams.get("ids");
    const client = await connectDatabase();

    const ids = idsParam
      ? idsParam.split(",").map((id) => new ObjectId(id))
      : [];

    let result;

    switch (type) {
      case "nameAndProfile":
        result = await getDocumentsByIds(client, "companies", ids, false, {
          _id: 1,
          name: 1,
          profilePicture: 1
        });
        break;
    }
    await client.close();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


