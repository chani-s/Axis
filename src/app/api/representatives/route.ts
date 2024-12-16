import { connectDatabase, getSpecificFields } from "@/app/services/mongo";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const client = await connectDatabase();
        const filter = { user_type: "representative" }; 
        const fields = { name: 1, email: 1, phone: 1, status: 1 };
        const representatives = await getSpecificFields(client, "users", filter, fields); 

        return NextResponse.json(representatives); 
    } catch (error) {
        return NextResponse.error();
    }
    
}

