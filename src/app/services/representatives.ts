"use client";
import { AxiosResponse } from "axios";
import { http } from "./http";
export const dynamic = 'force-dynamic';

export const fetchRepresentatives = async (): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await http.get("/representatives");
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch representatives:", error);
    throw error.response?.data?.message || "An error occurred";
  }
};

export const inviteRepresentative = async (email: string, name: string, companyId:string): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await http.post("/representatives", { email, name, companyId });
    return response.data;
  } catch (error: any) {
    console.error("Failed to invite representative:", error);
    throw error.response?.data?.message || "An error occurred";
  }
};
