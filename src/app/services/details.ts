import { AxiosResponse } from "axios";
import { http } from "./http";

export const updateUserByEmail = async (
    email: string,
    updateData: object
): Promise<AxiosResponse<any>> => {
    try {
        const response = await http.post("/update_user", {
            email,
            updateData,
        });
        return response;
    } catch (error) {
        console.error("Failed to update user by email:", error);
        throw error;
    }
};

  

