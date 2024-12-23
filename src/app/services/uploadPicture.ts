//services/uploadPicture.ts:
import { AxiosResponse } from "axios";
import { http } from "./http";

export const uploadPicture = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    console.log("Form data being sent:", formData.get("profile_picture"));
    try {
        console.log("***");
        const response: AxiosResponse = await http.post("/upload_picture", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }

        );
        return response.data.url;
    } catch (error: any) {
        if (error.response) {
            console.error("Error uploading profile picture:", error.response.data);
        } else {
            console.error("Error:", error.message);
        }
        throw error;
    }

};
