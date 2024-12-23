
import { connectDatabase, isExist, insertDocument, getSpecificFields, updateByEmail } from "@/app/services/mongo";
import { NextResponse, NextRequest } from "next/server";
import { hashPassword } from "../../services/hash";
import jwt from "jsonwebtoken";
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {

  const SECRET_KEY = process.env.SECRET_KEY;
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

    let userDetails;

    if (!userExist && userData.userType == "user") {
      userDetails = await insertDocument(
        client,
        "users",
        { email: userData.email, google_auth: userData.isWithGoogle, user_type: userData.userType }
      );
    }
    if (userExist && userData.userType == "representative") {
      const userId = await getSpecificFields(
        client,
        "users",
        { email: userData.email },
        {_id:1}
      );
      console.log(userId);
      console.log(userId[0]._id.toString());
      
      
      const passwordIsExist = await isExist(
        client,
        "hashed_passwords",
        { user_id: userId[0]._id.toString() }
      )

      console.log(passwordIsExist);
      

      if (!passwordIsExist) {

        const updateStatus = await updateByEmail(
          client,
          "users",
          userData.email,
          { status: "active" }
        )

        if (updateStatus) {
          userDetails = await getSpecificFields(
            client,
            "users",
            { email: userData.email },
            {}
          );
          userDetails = userDetails[0];

        }
      }


    }

    console.log("uuu");
    
    console.log(userDetails);

    if (userDetails?._id) {
      const hashedPassword = await hashPassword(userData.password);
      const insertUserPassword = await insertDocument(
        client,
        "hashed_passwords",
        { user_id: userDetails?._id.toString(), password: hashedPassword }
      );

      const token = jwt.sign(
        { userId: userDetails._id },
        SECRET_KEY ? SECRET_KEY : "",
        { expiresIn: "1h" }
      );

      responseDetails.message = "User signup successfully";
      const { _id, ...userWithoutId } = userDetails;
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

    responseDetails.message = "User is exist";
    await client.close();
    return NextResponse.json(responseDetails);
  }
  catch (error) {
    console.error("Error fetching login:", error);
    return NextResponse.error();
  }
}

