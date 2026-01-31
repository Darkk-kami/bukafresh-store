import { API } from "@/shared/api/axiosInstance";

export async function getCurrentUserProfile() {
  try {
    const response = await API.get("/users/me");
    return response.data;
  } catch (error) {
    console.error("Get profile error:", error);
    
    if (error.response?.status === 401) {
      throw new Error("Please log in to view your profile.");
    } else if (error.response?.status === 403) {
      throw new Error("You don't have permission to view this profile.");
    } else if (error.response?.status === 404) {
      throw new Error("Profile not found. Please contact support.");
    } else if (error.response?.status >= 500) {
      throw new Error("We're having trouble loading your profile right now. Please try again in a few minutes.");
    } else if (error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
      throw new Error("Cannot connect to server. Please check your internet connection.");
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Failed to load profile. Please try again.");
    }
  }
}