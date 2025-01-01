// services/representatives.ts
"use client";
import { AxiosResponse } from "axios";
import { http } from "./http";
export const dynamic = 'force-dynamic';

export const fetchRepresentatives = async (companyId: string | null): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await http.get(`/representatives?companyId=${companyId}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch representatives:", error);
    if (error.response?.status === 409) {
      throw new Error("כתובת המייל כבר קיימת במערכת.");
    }
    throw error.response?.data?.message || "An error occurred";
  }
};


export const inviteRepresentative = async (email: string, name: string, companyId: string, profilePicture: string): Promise<any> => {
  try {
    console.log("Inviting representative with:", { email, name, companyId, profilePicture });
    const response: AxiosResponse<any> = await http.post("/representatives", { email, name, companyId, profilePicture });
    return response.data;
  } catch (error: any) {
    console.error("Failed to invite representative:", error);
    throw error;
  }
};


