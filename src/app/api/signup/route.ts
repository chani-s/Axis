
import { connectDatabase, isExist, insertDocument } from "@/app/services/mongo";
import { NextResponse, NextRequest } from "next/server";
import { hashPassword} from "../../services/hash";
import jwt from "jsonwebtoken";

//const token = req.cookies.get("authToken");
// const decoded = jwt.verify(token, SECRET_KEY);

export async function POST(req: NextRequest) {

  const SECRET_KEY = "m10r07w24";
  const userData = await req.json();
  const responseDetails = {
    message: "",
    userDetails: {},
    token: ""
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

        const token = jwt.sign(
          { userId: insertUserDetails._id },
          SECRET_KEY, 
          { expiresIn: "1h" } 
        );

        responseDetails.message = "User signup successfully";
        const { _id, ...userWithoutId } = insertUserDetails;
        responseDetails.userDetails = userWithoutId;
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

