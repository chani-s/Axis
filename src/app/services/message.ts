import { AxiosResponse } from "axios";
import { http } from "./http";

export async function getMessages(conversationId: string, userType:string) {
    try {
        const response: AxiosResponse<any> = await http.get(
          `/massages/?conversationId=${conversationId}&userType=${userType}`
        )
  
        return response.data;
    } catch (error) {
      console.error("Error fetching company name and profile:", error);
      throw error;
    }
  }