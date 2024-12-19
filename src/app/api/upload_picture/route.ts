import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import cloudinary from "../../services/cloudinary";
import { Readable } from "stream";

const uploadDir = path.join(process.cwd(), "tmp");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

async function convertRequestToBuffer(req: Request): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const readableStream = req.body;

  if (!readableStream) {
    throw new Error("Request body is empty.");
  }

  const reader = readableStream.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks);
}

function bufferToReadable(buffer: Buffer): Readable {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export async function POST(req: Request): Promise<Response> {
  const form = new formidable.IncomingForm({
    keepExtensions: true,
    uploadDir: uploadDir,
  });

  try {
    const buffer = await convertRequestToBuffer(req); 
    const stream = bufferToReadable(buffer);

    return new Promise<Response>((resolve, reject) => {
      form.parse(stream as any, async (err, fields, files) => {
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

        try {
          const result = await cloudinary.uploader.upload(file.filepath, {
            folder: "profile_pictures",
            resource_type: "image",
          });

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
