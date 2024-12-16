
import { connectDatabase, getSpecificFields, getById } from "@/app/services/mongo";
import { NextResponse, NextRequest } from "next/server";
import {verifyPassword} from "../../services/hash";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  
  const SECRET_KEY = "m10r07w24";
  const responseDetails = {
    message: "",
    userDetails: {},
    token: ""
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
          const userDetails = await getById(
            client,
            "users",
            userId
          );

          const token = jwt.sign(
            { userId: userDetails._id },
            SECRET_KEY, 
            { expiresIn: "1h" } 
          );
          responseDetails.message = "User login successfully";
          const { _id, ...userWithoutId } = userDetails;
          responseDetails.userDetails = userDetails;
          responseDetails.token = token;
  
          const response = NextResponse.json(responseDetails);
          response.cookies.set("authToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 3600 
          });
  
          await client.close();
          return response;
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
