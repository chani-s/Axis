import { http } from "./http";
import { conversationsStore } from "./zustand";

// Logout function to clear the token and perform cleanup
export const logout = async (): Promise<void> => {
  try {
    // Send a POST request to the server to clear the cookie
    const response = await http.post("logout");

    if (response.status === 200) {
      console.log("Logged out successfully");
    } else {
      console.error("Logout failed: ", response.data);
    }
  } catch (error) {
    console.error("Error during logout: ", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};
