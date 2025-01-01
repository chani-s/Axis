//api/representatives/route.ts
import { connectDatabase, getSpecificFields, insertDocument, isExist } from "@/app/services/mongo";
import { NextResponse, NextRequest } from "next/server";
import sendEmail from "../../services/sendEmails";
import { ObjectId } from 'mongodb';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const client = await connectDatabase();
        const { searchParams } = new URL(req.url);
        const companyId = searchParams.get("companyId");

        const filter: any = {
            user_type: "representative",
            companyId: companyId
        };
        const fields = { name: 1, email: 1, phone: 1, status: 1 };
        const representatives = await getSpecificFields(client, "users", filter, fields);

        return NextResponse.json(representatives);
    } catch (error) {
        return NextResponse.error();
    }
}

export async function POST(req: NextRequest) {
    try {
        const { email, name, companyId, profilePicture } = await req.json();
        const client = await connectDatabase();
        const userExist = await isExist(
            client,
            "users",
            { email: email },
        );

        if (!userExist) {
            const insertUserDetails = await insertDocument(
                client,
                "users",
                { email: email, name: name, companyId: companyId, status: "invited", user_type: "representative", profile_picture: profilePicture,conversations:0}
            );

            const companyName = await getSpecificFields(
                client,
                "companies",
                { _id: new ObjectId(companyId) },
                { businessDisplayName: 1 }
            );

            console.log(companyName);

            if (insertUserDetails && companyName) {
                await sendEmail(email,
                    ` הזמנת הצטרפות כנציג לחברת ${companyName[0].businessDisplayName}`,
                    `${companyName[0].businessDisplayName} ,מזמינה אותך להצטרף לשירותי נציג של החברה
                    לסיום התחברות לחץ על כפתור הירשם עכשיו  🎉🎉`, true, false, {});

                await client.close();
                return NextResponse.json({ message: "בקשת הצטרפות נשלחה לנציג" });
            }
            else {
                await client.close();
                return NextResponse.json({ message: "שגיאה בתהליך ההזמנה, רענן או נסה שוב מאוחר יותר" }
                );
            }
        }
        else {
            return NextResponse.json(
                { message: "כתובת המייל כבר קיימת במערכת." },
                { status: 409 }
            );
        }

        await client.close();

    } catch (error) {
        console.error("שגיאה בהזמנת נציג", error);
        return NextResponse.error();
    }
}

