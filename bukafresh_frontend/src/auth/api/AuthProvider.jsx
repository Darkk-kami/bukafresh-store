import { createContext, useContext, useState, useCallback } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  verifyEmail as apiVerifyEmail,
  resendVerificationEmail as apiResendVerificationEmail,
} from "@auth/api/authService";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { showSuccessAlert, showErrorAlert } from "@/shared/customAlert";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [tempData, setTempData] = useState({
    email: "",
    otp: "",
  });
  const queryClient = useQueryClient();

  const saveUser = (data) => {
    setUser(data);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("authToken");
    const userEmail = localStorage.getItem("userEmail");

    console.log("Checking auth status:", { token: !!token, userEmail });

    if (token && userEmail) {
      // TODO: Add token expiry check if needed
      setIsAuthenticated(true);
      console.log("User is authenticated");
    } else {
      setIsAuthenticated(false);
      console.log("User is not authenticated");
    }

    setIsLoading(false);
  };

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiLogin({ email, password });

      if (!response.success) {
        throw new Error(response?.message || "Login failed");
      }

      // Store JWT token instead of email/password
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userEmail", response.data.email);
      localStorage.setItem("userId", response.data.userId);

      saveUser(response.data);
      setIsAuthenticated(true);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRegister(userData);
      if (!response.success) {
        throw new Error(response?.message);
      }
      saveUser(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

 

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    queryClient.clear();
  }, [queryClient]);

  const verifyEmail = useCallback(async ({ token, userId }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiVerifyEmail({ token, userId });
      if (response.success) {
        showSuccessAlert("Email Verified!", response.message || "Your email has been successfully verified");
        
        // Store JWT token and user data after successful verification
        if (response.data?.token) {
          localStorage.setItem("authToken", response.data.token);
          localStorage.setItem("userEmail", response.data.email);
          localStorage.setItem("userId", response.data.userId);
          
          saveUser(response.data);
          setIsAuthenticated(true);
        }
        
        return response;
      } else {
        throw new Error(response.message || "Email verification failed");
      }
    } catch (err) {
      const errorMessage = err.message || "We couldn't verify your email. Please try again.";
      showErrorAlert("Verification Failed", errorMessage);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resendVerificationEmail = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiResendVerificationEmail(email);
      if (response.success) {
        showSuccessAlert("Email Sent!", response.message || "Verification email has been sent to your inbox");
        return response;
      } else {
        throw new Error(response.message || "Failed to resend verification email");
      }
    } catch (err) {
      const errorMessage = err.message || "We couldn't send your verification email. Please try again.";
      showErrorAlert("Send Failed", errorMessage);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        tempData,
        isLoading,
        setTempData,
        logout,
        loading,
        error,
        verifyEmail,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
