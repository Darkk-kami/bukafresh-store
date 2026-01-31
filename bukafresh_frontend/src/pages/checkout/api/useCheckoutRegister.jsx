import { useMutation } from "@tanstack/react-query";
import { checkoutRegister } from "./checkoutRegisterApi";

export function useCheckoutRegister() {
  return useMutation({
    mutationFn: checkoutRegister,
    onError: (error) => {
      // Log the error for debugging
      console.error("Checkout registration mutation error:", error);
    },
  });
}
