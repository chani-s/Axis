
import { connectDatabase, getSpecificFields, getById, insertDocument } from "@/app/services/mongo";
import { NextResponse, NextRequest } from "next/server";
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
        console.log(userData);

        if (!userData.email) {
            return NextResponse.json({ message: "Missing email" }, { status: 400 });
        }
        const client = await connectDatabase();
        const userExist = await getSpecificFields(
            client,
            "users",
            { email: userData.email },
            { _id: 1 }
        );

        console.log(userExist);

        if (userExist[0]) {
            const userId = userExist[0]._id.toString();
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
              responseDetails.message = "User register successfully";
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
            const insertUserDetails = await insertDocument(
                client,
                "users",
                { email: userData.email, name: userData.name, google_auth: userData.isWithGoogle, user_type: userData.userType }
            );
            console.log(insertUserDetails);

            if (insertUserDetails) {
                const token = jwt.sign(
                    { userId: insertUserDetails._id },
                    SECRET_KEY, 
                    { expiresIn: "1h" } 
                  );
          
                  responseDetails.message = "User register successfully";
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
        await client.close();
        console.log(responseDetails);
        return NextResponse.json(responseDetails);
    }

    catch (error) {
        console.error("Error fetching login:", error);
        return NextResponse.error();
    }
}
