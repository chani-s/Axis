"use client"
import { AxiosResponse } from "axios";
import { http } from "./http";


export const signUpUser = async (userData: {
    email: string;
    password: string;
    isWithGoogle: boolean;
}): Promise<AxiosResponse<any>> => {
    console.log("services");
    console.log(userData);
    
    const response = await http.post("/user", userData);
    return response.data; 
};

export const loginUser = async (userData: {
    email: string;
    password: string;
    isWithGoogle: boolean;
  }): Promise<any> => {
    const queryParams = new URLSearchParams(userData as any).toString();
    const response: AxiosResponse<any> = await http.get(`/user?${queryParams}`);
    return response.data;
  };
