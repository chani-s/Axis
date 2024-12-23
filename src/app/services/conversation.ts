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
export async function getRepConversations(): Promise<any> {
  try {
    const response: AxiosResponse<any> = await http.get(
      "/conversation/representative"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createConversation(conversationData: any): Promise<any> {
  console.log("in conv service" + conversationData.toString());

  const { company_id, ...otherData } = conversationData;

  const queryParams = new URLSearchParams({
    company_id: company_id.toString(), // Ensure it's a string
  });

  console.log("Query Params:", queryParams.toString());


  try {
    console.log("in conv service in try");

    const response = await http.post(`/conversation?${queryParams}`, otherData);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
}


export const deleteConversation = async (conversationId: string) => {
  try {
    // Use URLSearchParams to prepare the query parameter
    const queryParams = new URLSearchParams({ conversationId }).toString();

    // Perform the DELETE request
    const response = await http.delete(`/conversation?${queryParams}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      console.log(response.data.message); // Handle success
    } else {
      console.error(response.data.error); // Handle error
    }
  } catch (error) {
    console.error('Error deleting conversation:', error);
  }
};
