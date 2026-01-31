import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8084/api";

console.log("Subscription service using API_BASE_URL:", API_BASE_URL);

// Create axios instance with auth token
const createAuthenticatedRequest = () => {
  const token = localStorage.getItem("authToken");
  console.log("Creating authenticated request with token:", token ? "Token exists" : "No token");
  
  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }
  
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const subscriptionService = {
  // Health check endpoint (no auth required)
  healthCheck: async () => {
    try {
      console.log("Health check to:", `${API_BASE_URL}/health`);
      const response = await axios.get(`${API_BASE_URL}/health`);
      console.log("Health check response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Health check error:", error);
      throw new Error("Backend is not accessible");
    }
  },

  // Test endpoint
  testConnection: async () => {
    try {
      const api = createAuthenticatedRequest();
      console.log("Testing connection to:", `${API_BASE_URL}/subscriptions/test`);
      const response = await api.get("/subscriptions/test");
      console.log("Test connection response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Test connection error:", error);
      console.log("Test error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      throw new Error(
        error.response?.data?.message || "Failed to connect to subscription service"
      );
    }
  },

  // Test subscription creation
  testCreateSubscription: async () => {
    try {
      const api = createAuthenticatedRequest();
      const testData = {
        tier: "STANDARD",
        billingCycle: "MONTHLY",
        deliveryDay: "SATURDAY"
      };
      const response = await api.post("/subscriptions", testData);
      return response.data;
    } catch (error) {
      console.error("Test create subscription error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create test subscription"
      );
    }
  },

  // Get current user's active subscription
  getCurrentSubscription: async () => {
    try {
      const api = createAuthenticatedRequest();
      console.log("Making subscription API call to:", `${API_BASE_URL}/subscriptions/me`);
      const response = await api.get("/subscriptions/me");
      console.log("Subscription API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Get subscription error:", error);
      console.log("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // Handle 404 errors gracefully (user has no subscription)
      if (error.response?.status === 404) {
        throw new Error("No subscription found");
      }
      
      throw new Error(
        error.response?.data?.message || "Failed to fetch subscription"
      );
    }
  },

  // Get all user subscriptions (including inactive ones)
  getAllUserSubscriptions: async () => {
    try {
      const api = createAuthenticatedRequest();
      const response = await api.get("/subscriptions/me/all");
      return response.data;
    } catch (error) {
      console.error("Get all subscriptions error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch subscriptions"
      );
    }
  },

  // Create new subscription
  createSubscription: async (subscriptionData) => {
    try {
      const api = createAuthenticatedRequest();
      const response = await api.post("/subscriptions", subscriptionData);
      return response.data;
    } catch (error) {
      console.error("Create subscription error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create subscription"
      );
    }
  },

  // Pause subscription
  pauseSubscription: async (subscriptionId) => {
    try {
      const api = createAuthenticatedRequest();
      const response = await api.put(`/subscriptions/${subscriptionId}/pause`);
      return response.data;
    } catch (error) {
      console.error("Pause subscription error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to pause subscription"
      );
    }
  },

  // Resume subscription
  resumeSubscription: async (subscriptionId) => {
    try {
      const api = createAuthenticatedRequest();
      const response = await api.put(`/subscriptions/${subscriptionId}/resume`);
      return response.data;
    } catch (error) {
      console.error("Resume subscription error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to resume subscription"
      );
    }
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId) => {
    try {
      const api = createAuthenticatedRequest();
      const response = await api.put(`/subscriptions/${subscriptionId}/cancel`);
      return response.data;
    } catch (error) {
      console.error("Cancel subscription error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to cancel subscription"
      );
    }
  },

  // Activate subscription (after payment)
  activateSubscription: async (subscriptionId) => {
    try {
      const api = createAuthenticatedRequest();
      const response = await api.put(`/subscriptions/${subscriptionId}/activate`);
      return response.data;
    } catch (error) {
      console.error("Activate subscription error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to activate subscription"
      );
    }
  },

  // Update subscription status
  updateSubscriptionStatus: async (subscriptionId, status) => {
    try {
      const api = createAuthenticatedRequest();
      const response = await api.put(
        `/subscriptions/${subscriptionId}/status?status=${status}`
      );
      return response.data;
    } catch (error) {
      console.error("Update subscription status error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update subscription status"
      );
    }
  },

  // Delete subscription (for pending/inactive subscriptions)
  deleteSubscription: async (subscriptionId) => {
    try {
      const api = createAuthenticatedRequest();
      const response = await api.delete(`/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error) {
      console.error("Delete subscription error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete subscription"
      );
    }
  },
};