
import { connectDatabase, getSpecificFields, getById, insertDocument } from "@/app/services/mongo";
import { NextResponse, NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    console.log("hi");
    
    const responseDetails = {
        message: "",
        userDetails: {}
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
            responseDetails.message = "User register successfully";
            responseDetails.userDetails = await getById(
                client,
                "users",
                userId
            );
        }
        else {
            const insertUserDetails = await insertDocument(
                client,
                "users",
                { email: userData.email, name: userData.name, google_auth: userData.isWithGoogle, user_type: userData.userType }
            );
            console.log(insertUserDetails);
            
            if (insertUserDetails) {
                responseDetails.message = "User register successfully";
                responseDetails.userDetails = insertUserDetails;
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
