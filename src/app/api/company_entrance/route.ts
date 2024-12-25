
import { connectDatabase, isExist, insertDocument, updateById } from "@/app/services/mongo";
import { NextResponse, NextRequest } from "next/server";
import { hashPassword } from "../../services/hash";
import sendEmail from "../../services/sendEmails";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
    console.log("route");

    const userData = await req.json();
    const responseDetails = {
        message: "",
        userDetails: {},
    }
    try {

        if (!userData.email || !userData.password || !userData.officialBusinessName
            || !userData.businessDisplayName || !userData.businessCode) {
            console.log("error");
            return NextResponse.json({ message: "Missing Details" }, { status: 400 });
        }

        const client = await connectDatabase();
        const companyExist = await isExist(
            client,
            "companies",
            { businessCode: userData.businessCode },
        );

        const userExist = await isExist(
            client,
            "users",
            { email: userData.email },
        );

        if (!userExist && !companyExist) {

            const companyDetails = await insertDocument(
                client,
                "companies",
                {
                    officialBusinessName: userData.officialBusinessName, businessDisplayName: userData.businessDisplayName,
                    businessCode: userData.businessCode, profilePicture: userData.profilePicture, status: "waiting",
                    profile_picture: "https://lowcostflight.co.il/wp-content/uploads/2017/12/wizz.jpg"
                }
            );

            if (companyDetails) {
                const userDetails = await insertDocument(
                    client,
                    "users",
                    {
                        company_id: companyDetails._id.toString(), email: userData.email, user_type: "manager", status: "waiting",
                        profile_picture: "https://lowcostflight.co.il/wp-content/uploads/2017/12/wizz.jpg",
                        name: companyDetails.businessDisplayName
                    }
                );
                if (userDetails) {
                    const hashedPassword = await hashPassword(userData.password);
                    const insertUserPassword = await insertDocument(
                        client,
                        "hashed_passwords",
                        { user_id: userDetails?._id.toString(), password: hashedPassword }
                    );

                    if (insertUserPassword) {
                        const detailsToSend = {
                            managerId: userDetails._id.toString(),
                            officialBusinessName: userData.officialBusinessName,
                            businessDisplayName: userData.businessDisplayName,
                            businessCode: userData.businessCode
                            //add send files
                        }
                        const managerEmail = process.env.MANAGER_EMAIL || "";
                        await sendEmail(managerEmail,
                            `מבקשת אישור הרשמה ${companyDetails.businessDisplayName}`,
                            `שלום מנהל יקר, חברת ${companyDetails.businessDisplayName} מבקשת אישור הצטרפות לאתר, 
                            עבור על הפרטים המצורפים ולאישור לחת על כתפור אישור חברה`, false, true, detailsToSend);

                        await client.close();
                        return NextResponse.json({
                            message: "הבקשה להרשמת חברה נשלחה בהצלחה",
                            userDetails: { businessDisplayName: companyDetails.businessDisplayName }
                        });
                    }
                }
            }

        }

        responseDetails.message = "company is exist";
        await client.close();
        return NextResponse.json(responseDetails);
    }
    catch (error) {
        console.error("Error fetching signup:", error);
        return NextResponse.error();
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const managerId = searchParams.get("manager");
    const managerAxisEmail = process.env.MANAGER_EMAIL || "";
    console.log(managerId);

    try {
        if (!managerId) {
            await sendEmail(managerAxisEmail,
                `בקשתך לאישור חברה נכשלה`,
                `בקשתך לאישור חברה נכשלה, רענן ונסה שוב או פנה למפתחי האתר לתמיכה תכנית`, false, false, {});
            console.error("Error: Missing required details:");
            return forgotDetailsPage();
        }

        const client = await connectDatabase();
        const updateManagerStatus = await updateById(
            client,
            "users",
            managerId,
            { status: "approved" }
        );

        const updateCompanyStatus = await updateById(
            client,
            "companies",
            updateManagerStatus?.company_id,
            { status: "approved" }
        );

        console.log(updateManagerStatus);
        console.log(updateCompanyStatus);


        if (updateManagerStatus && updateCompanyStatus) {
            await sendEmail(updateManagerStatus.email,
                `בקשתך לפתיחת חשבון חברה אושרה`,
                `שלום מנהל יקר, אישרנו את פתיחת החשבון עבור חברת ${updateCompanyStatus.businessDisplayName}
                 מוזמן להכנס לאתר עם האימיל והסיסמא שלך ולהתחיל לשרת את הלקוחות🎉🎉`, false, false, {});
            await sendEmail(managerAxisEmail,
                `בקשתך לאישור חברה הסתימה בהצלחה`,
                `בקשתך לאישור חברה הסתימה בהצלחה, החברה הוזמנה להתחיל להשתמש באתר 🎉🎉`, false, false, {});
            return successPage();

        } else {
            await sendEmail(managerAxisEmail,
                `בקשתך לאישור חברה נכשלה`,
                `בקשתך לאישור חברה נכשלה, רענן ונסה שוב או פנה למפתחי האתר לתמיכה תכנית`, false, false, {});
            return errorPage();
        }
    } catch (error) {
        await sendEmail(managerAxisEmail,
            `בקשתך לאישור חברה נכשלה`,
            `בקשתך לאישור חברה נכשלה, רענן ונסה שוב או פנה למפתחי האתר לתמיכה תכנית`, false, false, {});
        console.error("Error approving company:", error);
        return errorPage();
    }
}

function successPage() {
    const successMessage = "הפעולה בוצעה בהצלחה!🎉🎉🎉";

    return new NextResponse(
        `
        <!DOCTYPE html>
        <html lang="he">
        <head>
            <meta charset="UTF-8">
            <title>הודעה</title>
            <style>
                body {
                    margin: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    font-family: Arial, sans-serif;
                    background-color: #ddbb0ec7;
                    color: #333;
                }
                .message-box {
                    text-align: center;
                    padding: 20px;
                    border: 1px solid #ccc;
                    border-radius: 10px;
                    background-color: #fff;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .message-box h1 {
                    font-size: 24px;
                    margin: 0 0 10px;
                    color: #4CAF50;
                }
            </style>
            <script>
                setTimeout(() => {
                    window.close();
                }, 4000); 
            </script>
        </head>
        <body>
            <div class="message-box">
                <h1>${successMessage}</h1>
                <p>...החלון ייסגר אוטומטית בעוד רגע</p>
            </div>
        </body>
        </html>
        `,
        {
            headers: { "Content-Type": "text/html" },
            status: 200,
        }
    );
}

function errorPage() {
    const errorMessage = "שגיאה התרחשה, אנא נסי שוב.";

    return new NextResponse(
        `
            <!DOCTYPE html>
            <html lang="he">
            <head>
                <meta charset="UTF-8">
                <title>שגיאה</title>
                <style>
                    body {
                        margin: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        font-family: Arial, sans-serif;
                        background-color: #ddbb0ec7;
                        color: #333;
                    }
                    .message-box {
                        text-align: center;
                        padding: 20px;
                        border: 1px solid #ccc;
                        border-radius: 10px;
                        background-color: #fff;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .message-box h1 {
                        font-size: 24px;
                        margin: 0 0 10px;
                        color: #FF0000;
                    }
                </style>
                <script>
                    setTimeout(() => {
                        window.close();
                    }, 3000); // סוגר את החלון אחרי 3 שניות
                </script>
            </head>
            <body>
                <div class="message-box">
                    <h1>${errorMessage}</h1>
                    <p>החלון ייסגר אוטומטית בעוד רגע...</p>
                </div>
            </body>
            </html>
            `,
        {
            headers: { "Content-Type": "text/html" },
            status: 500,
        }
    );
}

function forgotDetailsPage() {
    const errorMessage = "חסרים פרטים נצרכים";

    return new NextResponse(
        `
            <!DOCTYPE html>
            <html lang="he">
            <head>
                <meta charset="UTF-8">
                <title>שגיאה</title>
                <style>
                    body {
                        margin: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        font-family: Arial, sans-serif;
                        background-color: #ddbb0ec7;
                        color: #333;
                    }
                    .message-box {
                        text-align: center;
                        padding: 20px;
                        border: 1px solid #ccc;
                        border-radius: 10px;
                        background-color: #fff;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .message-box h1 {
                        font-size: 24px;
                        margin: 0 0 10px;
                        color: #FF0000;
                    }
                </style>
                <script>
                    setTimeout(() => {
                        window.close();
                    }, 3000); // סוגר את החלון אחרי 3 שניות
                </script>
            </head>
            <body>
                <div class="message-box">
                    <h1>${errorMessage}</h1>
                    <p>החלון ייסגר אוטומטית בעוד רגע...</p>
                </div>
            </body>
            </html>
            `,
        {
            headers: { "Content-Type": "text/html" },
            status: 400,
        }
    );
}