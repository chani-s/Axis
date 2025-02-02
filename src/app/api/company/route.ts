export const dynamic = 'force-dynamic';

import {
  connectDatabase, getDocumentsByIds} from "@/app/services/mongo";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const idsParam = searchParams.get("ids");

    const ids = idsParam
      ? idsParam.split(",").map((id) => new ObjectId(id))
      : [];

    let result;
    console.log("in get");
    const client = await connectDatabase();

    result = await getDocumentsByIds(client, "companies", ids, false, {
      _id: 1,
      businessDisplayName: 1,
      profile_picture: 1,
    });
    await client.close();

    return NextResponse.json(result);
  } 
  catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { message: "Internal Server Error my" },
      { status: 500 }
    );
  }
}
