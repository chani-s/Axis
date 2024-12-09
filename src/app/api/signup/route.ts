
import { connectDatabase, isExist, insertDocument } from "@/app/services/mongo";
import { NextResponse, NextRequest } from "next/server";
import { hashPassword} from "../../services/hash";

export async function POST(req: NextRequest) {
  const userData = await req.json();
  const responseDetails = {
    message: "",
    userDetails: {}
  }
  try {

    if (!userData.email || !userData.password) {
      return NextResponse.json({ message: "Missing email or password" }, { status: 400 });
    }

    const client = await connectDatabase();
    const userExist = await isExist(
      client,
      "users",
      { email: userData.email },
    );

    if (!userExist) {
      const insertUserDetails = await insertDocument(
        client,
        "users",
        { email: userData.email, google_auth: userData.isWithGoogle, user_type: userData.userType }
      );
      console.log(insertUserDetails);
      if (insertUserDetails) {
        const hashedPassword = await hashPassword(userData.password);
        const insertUserPassword = await insertDocument(
          client,
          "hashed_passwords",
          { user_id: insertUserDetails?._id.toString(), password: hashedPassword }
        );

        responseDetails.message = "User signup successfully";
        responseDetails.userDetails = insertUserDetails;
      }
    }
    else
      responseDetails.message = "User is exist";
    await client.close();
    return NextResponse.json(responseDetails);
  }
  catch (error) {
    console.error("Error fetching login:", error);
    return NextResponse.error();
  }
}

