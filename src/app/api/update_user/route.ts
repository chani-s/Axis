import { NextRequest, NextResponse } from 'next/server';
import { connectDatabase, updateByEmail } from '../../services/mongo';

export async function POST(req: NextRequest) {
  try {
    const { email, updateData } = await req.json();

    if (!email || !updateData) {
      return NextResponse.json({ error: "Email and update data are required" }, { status: 400 });
    }

    const client = await connectDatabase();
    const updatedDocument = await updateByEmail(client, 'users', email, updateData);
    return NextResponse.json({ success: true, user: updatedDocument }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }


}
