import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import cloudinary from "../../services/cloudinary";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, 
  },
};

const uploadDir = path.join(process.cwd(), 'tmp');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); 
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm({
      keepExtensions: true,
      uploadDir: uploadDir, 
      filename: (name, ext, part, form) => part.originalFilename || name + ext,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: "Failed to parse form" });
      }

      const file = files.profile_picture?.[0]; // Access the file from the form
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      try {
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: "profile_pictures",
          resource_type: "image",
        });

        fs.unlinkSync(file.filepath); // Delete the temporary file after upload

        return res.status(200).json({ url: result.secure_url });
      } catch (error) {
        console.error("Error uploading file:", error);
        return res.status(500).json({ error: "Failed to upload file" });
      }
    });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
