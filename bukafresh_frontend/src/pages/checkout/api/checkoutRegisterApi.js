import { PublicAPI } from "@/shared/api/axiosInstance";

// Test function to check API connectivity
export async function testApiConnection() {
  try {
    console.log("Testing API connection to:", PublicAPI.defaults.baseURL);
    const response = await PublicAPI.get("/health"); // or any simple endpoint
    console.log("API connection test successful:", response.data);
    return true;
  } catch (error) {
    console.error("API connection test failed:", error);
    return false;
  }
}

export async function checkoutRegister(payload) {
  try {
    console.log(
      "Making API request to:",
      PublicAPI.defaults.baseURL + "/users/checkout-register",
    );
    console.log("Payload:", payload);

    const { data } = await PublicAPI.post("/users/checkout-register", payload);

    console.log("API Response:", data);
    // Return the data as-is since the API returns {success: boolean, message: string}
    return data;
  } catch (error) {
    console.error("API Error Details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers,
    });

    // Handle different HTTP status codes with user-friendly messages
    if (error.response?.status === 403) {
      // For local development, 403 might indicate CORS or missing headers
      throw new Error(
        "Server access denied. Check if your local server is running and configured properly.",
      );
    } else if (error.response?.status === 401) {
      throw new Error(
        "Authentication required. Please refresh the page and try again.",
      );
    } else if (error.response?.status === 404) {
      // Endpoint not found
      throw new Error(
        "Registration endpoint not found. Please check if your server is running on the correct port.",
      );
    } else if (error.response?.status === 409) {
      // Conflict - usually means duplicate data
      const apiMessage = error.response.data?.message || "";
      if (apiMessage.includes("email")) {
        throw new Error(
          "This email is already registered. Try logging in instead.",
        );
      } else if (apiMessage.includes("phone")) {
        throw new Error(
          "This phone number is already in use. Please use a different number.",
        );
      } else {
        throw new Error(
          "This information is already registered. Please check your details.",
        );
      }
    } else if (error.response?.status === 422) {
      // Validation error
      throw new Error("Please check your information and try again.");
    } else if (error.response?.status >= 500) {
      // Server error
      throw new Error(
        "Your local server is having trouble. Please check the server logs.",
      );
    } else if (
      error.code === "ERR_NETWORK" ||
      error.message?.includes("Network Error")
    ) {
      // Network/CORS error - common in local development
      throw new Error(
        "Cannot connect to your local server. Make sure it's running on port 8080 and CORS is enabled.",
      );
    } else if (error.response?.data) {
      // Other API errors with data
      const apiMessage = error.response.data.message || "";

      // Convert technical error messages to user-friendly ones
      if (apiMessage.includes("email") && apiMessage.includes("exists")) {
        throw new Error(
          "This email is already registered. Try logging in instead.",
        );
      } else if (
        apiMessage.includes("phone") &&
        apiMessage.includes("exists")
      ) {
        throw new Error(
          "This phone number is already in use. Please use a different number.",
        );
      } else if (apiMessage.includes("validation")) {
        throw new Error("Please check your information and try again.");
      } else {
        throw new Error(
          apiMessage || "Something went wrong. Please try again.",
        );
      }
    } else if (error.code === "NETWORK_ERROR" || !navigator.onLine) {
      // Network error
      throw new Error(
        "Please check your internet connection and make sure your local server is running.",
      );
    } else {
      // Other errors
      throw new Error(
        "Connection failed. Please check if your local server is running on port 8080.",
      );
    }
  }
}
