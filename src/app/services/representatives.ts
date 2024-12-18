"use client";
import { AxiosResponse } from "axios";
import { http } from "./http";

export const fetchRepresentatives = async (): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await http.get("/representatives");
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch representatives:", error);
    throw error.response?.data?.message || "An error occurred";
  }
};

export const inviteRepresentative = async (email: string): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await http.post("/representatives/invite", { email });
    return response.data;
  } catch (error: any) {
    console.error("Failed to invite representative:", error);
    throw error.response?.data?.message || "An error occurred";
  }
};
