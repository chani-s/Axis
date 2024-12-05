
import { connectDatabase, isExist, getSpecificFields, isEqual, insertDocument } from "@/app/services/mongo";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  console.log("router");
  const userData = await req.json();
  console.log(userData.email);
  
  
  const responseDetails = {
    message: "",
    userId: ""
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
    console.log(userExist);
    

    if (!userExist) {
      const insertUserDetails = await insertDocument(
        client,
        "users",
        { email: userData.email, google_auth: userData.isWithGoogle }
      );
      console.log(insertUserDetails);
      if (insertUserDetails) {
        const insertUserPassword = await insertDocument(
          client,
          "hashed_passwords",
          { user_id: insertUserDetails?._id.toString(), password: userData.password }
        );

        console.log(insertUserPassword);
        
        responseDetails.message = "User signup successfully";
        responseDetails.userId = insertUserDetails._id.toString();
      }
    }
    else
      responseDetails.message = "User is exist";
    await client.close();
    console.log(responseDetails);
    return NextResponse.json(responseDetails);
  }
  catch (error) {
    console.error("Error fetching login:", error);
    return NextResponse.error();
  }
}

export async function GET(req: NextRequest) {
  const responseDetails = {
    message: "",
    userId: ""
  }
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const password = searchParams.get("password");

    if (!email || !password) {
      return NextResponse.json({ message: "Missing email or password" }, { status: 400 });
    }
    const client = await connectDatabase();
    const userExist = await getSpecificFields(
      client,
      "users",
      { email: email },
      { _id: 1 }
    );

    if (userExist[0]) {
      const userId = userExist[0]._id.toString();
      console.log(userId);
      const userPassword = await isEqual(
        client,
        "hashed_passwords",
        { user_id: userId },
        password
      );
      if (userPassword) {
        responseDetails.message = "User login successfully";
        responseDetails.userId = userId;
      }
      else
        responseDetails.message = "Password is incorrect";
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
