import { http } from "./http";

import { AxiosResponse } from "axios";
import { getSpecificFields } from "./mongo";
import { Conversation } from "../models/Conversation";

const ComapnyService = {
  async getNameAndPorfile(): Promise<any> {
    try {
      const response: AxiosResponse<any> = await http.get(
        "/company/?type=nameAndProfile"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  
};

export default ComapnyService;
