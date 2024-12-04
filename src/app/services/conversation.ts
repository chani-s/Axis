import { AxiosResponse } from "axios";
import { http } from "./http";

const ConversationService={
    async getConversations():Promise<any>{
        try {
          const response: AxiosResponse<any> = await http.get(
            "/conversation"
          );
          return response.data;
        } catch (error) {
          throw error;
        }
      },
      async createConversation(conversationData: any): Promise<any> {
        try {
          const response = await http.post('/api/conversations', conversationData);
          return response.data; 
        } catch (error) {
          console.error('Error creating conversation:', error);
          throw error; 
        }
      }}
export default ConversationService;