import { connectDatabase, getSpecificFields, insertDocument } from "@/app/services/mongo";
import { NextResponse, NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { hashPassword } from "../../services/hash";
import sendEmail from "../../services/sendEmails";

export async function POST(req: NextRequest) {

    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Missing email" }, { status: 400 });
        }

        const verificationCode = randomBytes(3).toString('hex');

        const hashedVerificationCode = await hashPassword(verificationCode);

        const client = await connectDatabase();

        const userExist = await getSpecificFields(
            client,
            "users",
            { email: email },
            { _id: 1 }
        );

        if (userExist[0]) {
            const saveVerificationCode = await insertDocument(
                client,
                "verification_codes",
                { email: email, verificationCode: hashedVerificationCode },
            );

            if (saveVerificationCode) {
                await sendEmail(email,
                    "קוד אימות לשחזור סיסמא",
                     `הקוד שלך לאימות סיסמא הוא:
                     ${verificationCode}`);

                await client.close();
                return NextResponse.json({ message: "קוד אימות נשלח למייל שלך" });
            }
        }

        await client.close();
        return NextResponse.json({ message: "שגיאה בשליחה למערכת" });

    } catch (error) {
        console.error("Error sending verification code:", error);
        return NextResponse.error();
    }
}
