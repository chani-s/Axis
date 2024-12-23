//api/upload_picture/route.ts:
import { NextRequest, NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import cloudinary from "../../services/cloudinary";
import { Readable } from "stream";

const uploadDir = "/tmp";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

export async function POST(req: NextRequest): Promise<Response> {
    const form = new formidable.IncomingForm({
        keepExtensions: true,
        uploadDir: uploadDir,
    });

    try {
        return new Promise<NextResponse>((resolve, reject) => {
            console.log("Request headers:", req.headers);
            console.log("Request body:", req.body);
            // console.log("Files:", files);

            form.parse(req as any, async (err, fields, files) => {
                console.log(req.method, req.body, files);

                if (err) {
                    console.error("Error parsing form data:", err);
                    return resolve(
                        NextResponse.json({ error: "Failed to parse form data" }, { status: 500 })
                    );
                }

                const file = Array.isArray(files.profile_picture)
                    ? files.profile_picture[0]
                    : files.profile_picture;
                if (!file || !file.filepath) {
                    return resolve(
                        NextResponse.json({ error: "No file uploaded" }, { status: 400 })
                    );
                }
                console.log("File received:", file);
                if (!file || !file.filepath) {
                    console.error("No file uploaded or invalid file.");
                }


                try {
                    const result = await cloudinary.uploader.upload(file.filepath, {
                        folder: "profile_pictures",
                        resource_type: "image",
                    });
                    console.log("Uploading file:", file.filepath);

                    fs.unlinkSync(file.filepath);

                    return resolve(
                        NextResponse.json({ url: result.secure_url }, { status: 200 })
                    );
                } catch (error) {
                    console.error("Error uploading file:", error);
                    return resolve(
                        NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
                    );
                }
            });
        });
    } catch (error) {
        console.error("Error handling request:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}
