import { connectDatabase, getSpecificFields, insertDocument, isExist } from "@/app/services/mongo";
import { NextResponse, NextRequest } from "next/server";
import sendEmail from "../../services/sendEmails";
import { ObjectId } from 'mongodb';

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

export async function POST(req: NextRequest) {
    try {
        const { email, companyId, } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Missing email" }, { status: 400 });
        }
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
                { email: email, companyId: companyId, status: "invited", user_type: "representative" }
            );

            const companyName = await getSpecificFields(
                client,
                "companies",
                { _id: new ObjectId(companyId) },
                { name: 1 }
            );

            console.log(companyName);
            
            if (insertUserDetails && companyName) {
                await sendEmail(email,
                    ` הזמנת הצטרפות כנציג לחברת ${companyName[0].name}`,
                    `${companyName[0].name} ,מזמינה אותך להצטרף לשירותי נציג של החברה
                    לסיום התחברות לחץ על כפתור הירשם עכשיו  🎉🎉`, true);

                await client.close();
                return NextResponse.json({ message: "בקשת הצטרפות נשלחה לנציג" });
            }
            else {
                await client.close();
                return NextResponse.json({ message: "שגיאה בתהליך ההזמנה, רענן או נסה שוב מאוחר יותר" });
            }
        }

        await client.close();
        return NextResponse.json({ message: "אימייל קיים, נסה  אימייל שונה" });

    } catch (error) {
        console.error("שגיאה בהזמנת נציג", error);
        return NextResponse.error();
    }
}