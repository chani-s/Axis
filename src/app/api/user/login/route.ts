
import { connectDatabase, getSpecificFields, getById } from "@/app/services/mongo";
import { NextResponse, NextRequest } from "next/server";
import {verifyPassword} from "../../../services/hash";


export async function POST(req: NextRequest) {
  const responseDetails = {
    message: "",
    userDetails: {}
  }
  try {
    const userData = await req.json();

    if (!userData.email || !userData.password) {
      return NextResponse.json({ message: "Missing email or password" }, { status: 400 });
    }
    const client = await connectDatabase();
    const userExist = await getSpecificFields(
      client,
      "users",
      { email: userData.email },
      { _id: 1 }
    );

    if (userExist[0]) {
      const userId = userExist[0]._id.toString();
      console.log(userId);
      const userPassword = await getSpecificFields(
        client,
        "hashed_passwords",
        { user_id: userId },
        { password: 1 }
      );
      
      if (userPassword[0]) {
        const isCorrect = await verifyPassword(userData.password, userPassword[0].password);
        if (isCorrect) {
          responseDetails.message = "User login successfully";
          responseDetails.userDetails = await getById(
            client,
            "users",
            userId
          );
          console.log(responseDetails);
        }
        else
          responseDetails.message = "Password is incorrect";
      }
      else
        responseDetails.message = "Password does not exist";
    }
    else
      responseDetails.message = "User does not exist";
    await client.close();
    console.log(responseDetails);
    return NextResponse.json(responseDetails);
  }
  catch (error) {
    console.error("Error fetching login:", error);
    return NextResponse.error();
  }
}
