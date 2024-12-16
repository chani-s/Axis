import { connectDatabase, getSpecificFields, updateByUserId, deleteDocumentByEmail } from "@/app/services/mongo";
import { NextResponse, NextRequest } from "next/server";
import { hashPassword, verifyPassword } from "../../services/hash";

export async function POST(req: NextRequest) {
  try {
    const { code, newPassword, email } = await req.json();

    if (!code || !newPassword || !email) {
      return NextResponse.json({ message: "חסרים נתונים" }, { status: 400 });
    }

    const client = await connectDatabase();

    const verificationCodeIsMaching = await getSpecificFields(
      client,
      "verification_codes",
      { email: email },
      { verificationCode: 1 }
    );

    if (!verificationCodeIsMaching[0]) {
      await client.close();
      return NextResponse.json({ message: "קוד האימות לא נמצא" }, { status: 400 });
    }
    const verificationCodeHash=(verificationCodeIsMaching[verificationCodeIsMaching.length-1].verificationCode);
    const isCorrect = await verifyPassword(code, verificationCodeHash);

    if (isCorrect) {
      const hashedPassword = await hashPassword(newPassword);
      const userId = await getSpecificFields(
        client,
        "users",
        { email: email },
        { _id: 1 }
      );

      if (userId[0]) {
        const resetPassword = await updateByUserId(
          client,
          "hashed_passwords",
          userId[0]._id.toString(),
          { password: hashedPassword }
        );

        const deleteCode = await deleteDocumentByEmail(
          client,
          "verification_codes",
          email
        )
        if (resetPassword) {
          await client.close();
          return NextResponse.json({ message: "הסיסמא שונתה בהצלחה" });
        }
      }
    }

    await client.close();
    return NextResponse.json({ message: "שגיאה בעדכון הסיסמא" }, { status: 400 });

  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.error();
  }
}
