import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDatabase, getSpecificFields } from '@/app/services/mongo';
import { ObjectId } from 'mongodb';

const SECRET_KEY = "m10r07w24";

export async function GET(request: NextRequest) {
    try {
        const authToken = request.cookies.get('authToken')?.value;
        
        if (!authToken) {
            return new Response('Missing authToken', { status: 401 });
        }
        const decodedToken = jwt.verify(authToken, SECRET_KEY) as { userId: string };

        if (!decodedToken || !decodedToken.userId) {
            return new Response('Invalid token', { status: 401 });
        }

        const userId = new ObjectId(decodedToken.userId);

        console.log(`User ID from token: ${userId}`);

        const client = await connectDatabase();
        const db = client.db("Axis");
        const conversations=await getSpecificFields(client,"users",{_id:userId},{conversations:1});

        return NextResponse.json(conversations);        
    } catch (error) {
        console.error('JWT verification error:', error);
        return new Response('Unauthorized', { status: 401 });
    }
}
