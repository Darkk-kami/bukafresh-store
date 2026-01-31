import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "./paymentService";
import { showSuccessAlert, showErrorAlert } from "@/shared/customAlert";

export function usePayment() {
  const queryClient = useQueryClient();

  // Process payment mutation
  const processPaymentMutation = useMutation({
    mutationFn: paymentService.processPayment,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["payments"]);
      queryClient.invalidateQueries(["subscription"]);
      queryClient.invalidateQueries(["userProfile"]);
      showSuccessAlert("Payment Successful!", "Your subscription has been activated successfully.");
    },
    onError: (error) => {
      showErrorAlert("Payment Failed", error.message || "Failed to process payment");
    },
  });

  // Get user payments
  const {
    data: userPayments,
    isLoading: isLoadingPayments,
    error: paymentsError,
  } = useQuery({
    queryKey: ["payments", "user"],
    queryFn: paymentService.getUserPayments,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Get payment by ID
  const getPayment = (paymentId) => {
    return useQuery({
      queryKey: ["payment", paymentId],
      queryFn: () => paymentService.getPayment(paymentId),
      enabled: !!paymentId,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });
  };

  // Get subscription payments
  const getSubscriptionPayments = (subscriptionId) => {
    return useQuery({
      queryKey: ["payments", "subscription", subscriptionId],
      queryFn: () => paymentService.getSubscriptionPayments(subscriptionId),
      enabled: !!subscriptionId,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });
  };

  return {
    // Data
    userPayments: userPayments?.data,
    
    // Loading states
    isLoadingPayments,
    isProcessingPayment: processPaymentMutation.isPending,
    
    // Error states
    paymentsError,
    
    // Actions
    processPayment: processPaymentMutation.mutateAsync,
    getPayment,
    getSubscriptionPayments,
    
    // Helper functions
    isPaymentSuccessful: (payment) => {
      return payment?.status === "PAID";
    },
    
    isPaymentPending: (payment) => {
      return payment?.status === "PROCESSING" || payment?.status === "PENDING";
    },
    
    isPaymentFailed: (payment) => {
      return payment?.status === "FAILED";
    },
  };
}