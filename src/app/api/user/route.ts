import { verifyAuthToken } from "@/app/services/decodeToken";
import { connectDatabase, getById } from "@/app/services/mongo";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
    const client = await connectDatabase();
      const authToken = request.cookies.get("authToken")?.value;
  
      if (!authToken) {
        return new Response("Missing authToken", { status: 401 });
      }
  
      // Verify token and extract user ID
      const userId = await verifyAuthToken(authToken);
  
      // Fetch user by ID
      const user = await getById(client,"users",userId.toString());
  
      if (!user) {
        return new Response("User not found", { status: 404 });
      }
  
      return NextResponse.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }