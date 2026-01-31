import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionService } from "./subscriptionService";
import { useAuth } from "@/auth/api/AuthProvider";
import { showSuccessAlert, showErrorAlert } from "@/shared/customAlert";

export function useSubscription() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Get current subscription
  const {
    data: subscription,
    isLoading,
    error,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["subscription"],
    queryFn: subscriptionService.getCurrentSubscription,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    retry: (failureCount, error) => {
      console.log("Subscription query retry:", { failureCount, error: error?.message });
      // Don't retry on auth errors, not found errors, or server errors
      if (
        error.message?.includes("log in") ||
        error.message?.includes("permission") ||
        error.message?.includes("not found") ||
        error.message?.includes("No subscription found") ||
        error.message?.includes("404") ||
        error.message?.includes("500")
      ) {
        return false;
      }
      return failureCount < 3;
    },
    throwOnError: false, // Don't throw errors, handle them in the component
  });

  // Get all subscriptions
  const {
    data: allSubscriptions,
    isLoading: isLoadingAll,
    error: allError,
  } = useQuery({
    queryKey: ["subscriptions", "all"],
    queryFn: subscriptionService.getAllUserSubscriptions,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    throwOnError: false,
  });

  // Create subscription mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: subscriptionService.createSubscription,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["subscription"]);
      queryClient.invalidateQueries(["subscriptions"]);
      queryClient.invalidateQueries(["userProfile"]); // Also refresh profile
      // Don't show success alert here - let the component handle it
    },
    onError: (error) => {
      showErrorAlert(error.message || "Failed to create subscription");
    },
  });

  // Pause subscription mutation
  const pauseSubscriptionMutation = useMutation({
    mutationFn: subscriptionService.pauseSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries(["subscription"]);
      queryClient.invalidateQueries(["subscriptions"]);
      showSuccessAlert("Subscription paused successfully!");
    },
    onError: (error) => {
      showErrorAlert(error.message || "Failed to pause subscription");
    },
  });

  // Resume subscription mutation
  const resumeSubscriptionMutation = useMutation({
    mutationFn: subscriptionService.resumeSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries(["subscription"]);
      queryClient.invalidateQueries(["subscriptions"]);
      showSuccessAlert("Subscription resumed successfully!");
    },
    onError: (error) => {
      showErrorAlert(error.message || "Failed to resume subscription");
    },
  });

  // Cancel subscription mutation
  const cancelSubscriptionMutation = useMutation({
    mutationFn: subscriptionService.cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries(["subscription"]);
      queryClient.invalidateQueries(["subscriptions"]);
      showSuccessAlert("Subscription cancelled successfully!");
    },
    onError: (error) => {
      showErrorAlert(error.message || "Failed to cancel subscription");
    },
  });

  // Activate subscription mutation (after payment)
  const activateSubscriptionMutation = useMutation({
    mutationFn: subscriptionService.activateSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries(["subscription"]);
      queryClient.invalidateQueries(["subscriptions"]);
      queryClient.invalidateQueries(["userProfile"]); // Also refresh profile
      showSuccessAlert("Subscription activated successfully! Welcome to BukaFresh!");
    },
    onError: (error) => {
      showErrorAlert(error.message || "Failed to activate subscription");
    },
  });

  // Delete subscription mutation (for pending/inactive subscriptions)
  const deleteSubscriptionMutation = useMutation({
    mutationFn: subscriptionService.deleteSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries(["subscription"]);
      queryClient.invalidateQueries(["subscriptions"]);
      queryClient.invalidateQueries(["userProfile"]); // Also refresh profile
      showSuccessAlert("Subscription deleted successfully!");
    },
    onError: (error) => {
      showErrorAlert(error.message || "Failed to delete subscription");
    },
  });

  return {
    // Data
    subscription: subscription?.data,
    allSubscriptions: allSubscriptions?.data,
    
    // Loading states
    isLoading: isLoading, // Show loading regardless of error state initially
    isLoadingAll,
    isCreating: createSubscriptionMutation.isPending,
    isPausing: pauseSubscriptionMutation.isPending,
    isResuming: resumeSubscriptionMutation.isPending,
    isCancelling: cancelSubscriptionMutation.isPending,
    isActivating: activateSubscriptionMutation.isPending,
    isDeleting: deleteSubscriptionMutation.isPending,
    
    // Error states
    error,
    allError,
    isError,
    
    // Actions
    createSubscription: createSubscriptionMutation.mutateAsync,
    pauseSubscription: pauseSubscriptionMutation.mutate,
    resumeSubscription: resumeSubscriptionMutation.mutate,
    cancelSubscription: cancelSubscriptionMutation.mutate,
    activateSubscription: activateSubscriptionMutation.mutate,
    deleteSubscription: deleteSubscriptionMutation.mutate,
    refetch,
    
    // Helper functions
    hasActiveSubscription: () => {
      return subscription?.data?.status === "ACTIVE";
    },
    
    isPaused: () => {
      return subscription?.data?.status === "PAUSED";
    },
    
    isCancelled: () => {
      return subscription?.data?.status === "CANCELED";
    },
  };
}