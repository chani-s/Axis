
import { connectDatabase, isExist,getSpecificFields,isEqual } from "@/app/services/mongo";
import { NextResponse, NextRequest} from "next/server";

export async function POST(userData: any) {
  try {
    const client = await connectDatabase();
    const companies = await isExist(
      client,
      "comapnies",
      {}
    );
    await client.close();
    console.log(companies);
    return NextResponse.json(companies);
  } catch (error) {
    console.error("Error fetching recipes:", error);
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
      {email:email},
      {_id:1}
    ); 
    
    if (userExist[0]) {
      const userId = userExist[0]._id.toString();
      console.log(userId);
      const userPassword = await isEqual(
        client,
        "hashed_passwords",
        {user_id:userId},
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
