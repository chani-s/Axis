
import { connectDatabase, getSpecificFields, getById, updateByEmail, insertDocument } from "@/app/services/mongo";
import { NextResponse, NextRequest } from "next/server";
import { verifyPassword } from "../../services/hash";
import jwt from "jsonwebtoken";
import { useFormStatus } from "react-dom";
export const dynamic = 'force-dynamic';
import { hashPassword } from "../../services/hash";

export async function POST(req: NextRequest) {

  const SECRET_KEY = process.env.SECRET_KEY;
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
      {}
    );

    if (userExist[0]) {
      console.log("details");
      console.log(userExist[0]);

      if (userExist[0].user_type == "manager" && userExist[0].status == "waiting") {
        responseDetails.message = "Manager account is waiting for approval.";
        responseDetails.userDetails = {};
        await client.close();
        return NextResponse.json(responseDetails, { status: 403 });
      }
      if (userExist[0].user_type == "representative" && userExist[0].status == "invited") {
        responseDetails.message = "please sign up";
        responseDetails.userDetails = {};
        await client.close();
        return NextResponse.json(responseDetails, { status: 403 });
      }
      const userId = userExist[0]._id.toString();
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
          if (userDetails.user_type == "representative") {
            const updateStatus = await updateByEmail(
              client,
              "users",
              userDetails.email,
              { status: "active" }
            )
            userDetails.status = "active";
          }

          console.log(userDetails);


          const token = jwt.sign(
            { userId: userDetails._id },
            SECRET_KEY ? SECRET_KEY : "",
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
      else {
        const userDetails = await getById(
          client,
          "users",
          userId
        );
        if (userDetails.google_auth) {
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
        else {
          responseDetails.message = "Password does not exist";
        }
      }

    }
    else
      responseDetails.message = "User does not exist";
    await client.close();
    return NextResponse.json(responseDetails);
  }
  catch (error) {
    console.error("Error fetching login:", error);
    return NextResponse.error();
  }
}


