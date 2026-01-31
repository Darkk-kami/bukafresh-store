import { API, PublicAPI } from "../../shared/api/axiosInstance";

export async function register(userData) {
  try {
    const response = await PublicAPI.post("/users/register", userData);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    
    if (error.response?.status === 409) {
      const apiMessage = error.response.data?.message || "";
      if (apiMessage.includes("email")) {
        throw new Error("This email is already registered. Try signing in instead.");
      } else if (apiMessage.includes("phone")) {
        throw new Error("This phone number is already in use. Please use a different number.");
      } else {
        throw new Error("This information is already registered. Please check your details.");
      }
    } else if (error.response?.status === 422) {
      throw new Error("Please check your information and try again.");
    } else if (error.response?.status >= 500) {
      throw new Error("We're having trouble creating your account right now. Please try again in a few minutes.");
    } else if (error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
      throw new Error("Cannot connect to server. Please check your internet connection.");
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Registration failed. Please try again.");
    }
  }
}

export async function login({ email, password }) {
  try {
    const response = await PublicAPI.post("/users/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    
    if (error.response?.status === 401) {
      throw new Error("Invalid email or password. Please check your credentials and try again.");
    } else if (error.response?.status === 403) {
      const message = error.response.data?.message || "";
      if (message.includes("verify")) {
        throw new Error("Please verify your email before signing in. Check your inbox for the verification link.");
      } else {
        throw new Error("Access denied. Please contact support if this continues.");
      }
    } else if (error.response?.status === 404) {
      throw new Error("No account found with this email. Please check your email or create a new account.");
    } else if (error.response?.status >= 500) {
      throw new Error("We're having trouble signing you in right now. Please try again in a few minutes.");
    } else if (error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
      throw new Error("Cannot connect to server. Please check your internet connection.");
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Login failed. Please try again.");
    }
  }
}


export async function verifyEmail({ token, userId }) {
  try {
    const response = await PublicAPI.get(`/users/verify-email`, {
      params: { token, userId }
    });
    return response.data;
  } catch (error) {
    console.error("Email verification error:", error);
    
    if (error.response?.status === 400) {
      throw new Error("This verification link is not valid. Please check your email for the correct link.");
    } else if (error.response?.status === 404) {
      throw new Error("We couldn't find your verification request. Please try requesting a new verification email.");
    } else if (error.response?.status === 410 || error.response?.data?.message?.includes("expired")) {
      throw new Error("This verification link has expired. Please request a new one.");
    } else if (error.response?.data?.message?.includes("already verified")) {
      throw new Error("Your email is already verified! You can start shopping now.");
    } else if (error.response?.status >= 500) {
      throw new Error("We're having trouble verifying your email right now. Please try again in a few minutes.");
    } else if (!navigator.onLine) {
      throw new Error("Please check your internet connection and try again.");
    } else {
      throw new Error("We couldn't verify your email. Please try again or contact support if the problem continues.");
    }
  }
}

export async function resendVerificationEmail(email) {
  try {
    const response = await PublicAPI.post("/users/resend-verification-email", null, {
      params: { email }
    });
    return response.data;
  } catch (error) {
    console.error("Resend verification error:", error);
    
    // Transform technical errors into user-friendly messages
    if (error.response?.status === 400) {
      throw new Error("Please enter a valid email address.");
    } else if (error.response?.status === 404) {
      throw new Error("We couldn't find an account with that email address. Please check your email or create a new account.");
    } else if (error.response?.status === 429) {
      throw new Error("You've requested too many verification emails. Please wait a few minutes before trying again.");
    } else if (error.response?.data?.message?.includes("already verified")) {
      throw new Error("Your email is already verified! You can start shopping now.");
    } else if (error.response?.status >= 500) {
      throw new Error("We're having trouble sending your verification email right now. Please try again in a few minutes.");
    } else if (!navigator.onLine) {
      throw new Error("Please check your internet connection and try again.");
    } else {
      throw new Error("We couldn't send your verification email. Please try again or contact support if the problem continues.");
    }
  }
}
