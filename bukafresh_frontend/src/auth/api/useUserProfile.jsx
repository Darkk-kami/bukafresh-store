import { useQuery } from "@tanstack/react-query";
import { getCurrentUserProfile } from "./userProfileService";
import { useAuth } from "./AuthProvider";

export function useUserProfile() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["userProfile"],
    queryFn: getCurrentUserProfile,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (
        error.message?.includes("log in") ||
        error.message?.includes("permission")
      ) {
        return false;
      }
      return failureCount < 3;
    },
    onError: (error) => {
      console.error("Profile fetch error:", error);
    },
  });
}
