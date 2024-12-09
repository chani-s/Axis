"use client"
import { AxiosResponse } from "axios";
import { http } from "./http";


export const signUpUser = async (userData: {
  email: string;
  password: string;
  isWithGoogle: boolean;
  userType: string;
}): Promise<AxiosResponse<any>> => {
  console.log("services");
  console.log(userData);

  const response = await http.post("/signup", userData);
  return response.data;
};

export const loginUser = async (userData: {
  email: string;
  password: string;
  isWithGoogle: boolean;
}): Promise<any> => {
  const response: AxiosResponse<any> = await http.post('/login',userData);
  return response.data;
};

export const registerWithGoogle = async (userData: {
  email: string;
  name: string;
  isWithGoogle: boolean;
  userType: string;
}): Promise<AxiosResponse<any>> => {
  console.log("google");
  console.log(userData);

  const response: AxiosResponse<any> = await http.post('/google_register',userData);
  return response.data;
};
