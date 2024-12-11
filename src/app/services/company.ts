import { http } from "./http";

import { AxiosResponse } from "axios";
import { getSpecificFields } from "./mongo";
import { Conversation } from "../models/Conversation";
const CompanyService = {
  async getNameAndProfile(ids: string[]): Promise<any> {
    try {
      let idsQuery;
      // if(Serialize the IDs array into a comma-separated string
      if(ids){
        idsQuery =ids.join(",");
        
      }else{
        idsQuery = [];
      }
  
      // Include the IDs in the query parameters
      const response: AxiosResponse<any> = await http.get(
        `/company/?type=nameAndProfile&ids=${idsQuery}`
      );
      
      return response.data;
    } catch (error) {
      console.error("Error fetching company name and profile:", error);
      throw error;
    }
  }
};

export default CompanyService;
