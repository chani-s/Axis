
import { connectDatabase, getSpecificFields, getById, insertDocument, updateByEmail } from "@/app/services/mongo";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {

    const SECRET_KEY = process.env.SECRET_KEY;
    const responseDetails = {
        message: "",
        userDetails: {},
        token: ""
    }
    try {
        const userData = await req.json();
        console.log("Register goofle details: " + userData)

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

        if (userExist[0]) {
            const userId = userExist[0]._id.toString();
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
                    { status: "active", google_auth: true }
                )
                userDetails.status = "active";
            }

            if (userDetails.user_type == "manager" && userDetails.status == "approved") {
                const updateStatus = await updateByEmail(
                    client,
                    "users",
                    userDetails.email,
                    { google_auth: true }
                )
            }
            if (userDetails.user_type == "manager" && userDetails.status == "waiting") {
                responseDetails.message = "manager is not approved";
                responseDetails.userDetails = {};
                await client.close();
                return NextResponse.json(responseDetails);;

            }

            const token = jwt.sign(
                { userId: userDetails._id },
                SECRET_KEY ? SECRET_KEY : "",
                { expiresIn: "1h" }
            );
            responseDetails.message = "User register successfully";
            //const { _id, ...userWithoutId } = userDetails;
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
            console.log(userData.profilePicture)
            const insertUserDetails = await insertDocument(
                client,
                "users",
                { email: userData.email, name: userData.name, google_auth: userData.isWithGoogle, user_type: userData.userType, profile_picture: userData.profilePicture }
            );

            if (insertUserDetails) {
                const token = jwt.sign(
                    { userId: insertUserDetails._id },
                    SECRET_KEY ? SECRET_KEY : "",
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
