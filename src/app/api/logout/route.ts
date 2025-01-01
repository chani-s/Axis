import { NextRequest, NextResponse } from "next/server";
import { connectDatabase, updateByEmail } from "@/app/services/mongo";
import pusher from "@/app/services/pusher"



export const dynamic = 'force-dynamic';  // Ensures dynamic rendering

export async function POST(req: NextRequest) {
  const client = await connectDatabase();
  const userData = await req.json();

  try {
    const updateStatus = await updateByEmail(
      client,
      "users",
      userData.email,
      { status: "inactive" }
    );

    await pusher.trigger(`company-${userData.companyId}`, "status-updated", {
      name: userData.name,
      email: userData.email,
      status: "inactive",
    });


  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }


  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.set("authToken", "", { maxAge: 0, path: "/" });

  return response;
}