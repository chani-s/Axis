import { AxiosResponse } from "axios";
import { http } from "./http";


export async function getConversations(): Promise<any> {
  try {
    const response: AxiosResponse<any> = await http.get("/conversation");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createConversation(conversationData: any): Promise<any> {
  const { company_id, user_id, ...otherData } = conversationData;

  const queryParams = new URLSearchParams({
    company_id: company_id.toString(), // Ensure it's a string
    user_id: user_id.toString(), // Ensure it's a string
  }).toString();

  try {
    const response = await http.post(
      `/conversation?${queryParams}`,
      otherData
    );
    console.log(response);

    return response.data;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
}
