
import { AxiosResponse } from "axios";
import { http } from "./http";


export const signUpUser = async (userData: {
    email: string;
    password: string;
    isWithGoogle: boolean;
}) => {
    const response: AxiosResponse<any> = await http.post('/user', userData);
    return response.data;
};

export const loginUser = async (userData: {
    email: string;
    password: string;
    isWithGoogle: boolean;
}) => {
    const response: AxiosResponse<any> = await http.get('/user');
    return response.data;
};
