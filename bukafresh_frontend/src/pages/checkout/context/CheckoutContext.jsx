import { createContext, useContext, useState, useCallback } from "react";

const initialState = {
  step: 1,
  selectedPackage: null,
  deliveryFrequency: "monthly",
  deliveryAddress: null,
  deliveryDay: "saturday",
  pendingPlanChange: null,
  addOns: [],
};

const CheckoutContext = createContext(null);

export function CheckoutProvider({ children }) {
  const [state, setState] = useState(initialState);

  const setPendingPlanChange = useCallback((change) => {
    setState((prev) => ({ ...prev, pendingPlanChange: change }));
  }, []);

  const setStep = useCallback((step) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({ ...prev, step: Math.min(prev.step + 1, 5) }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
  }, []);

  const selectPackage = useCallback((pkg) => {
    setState((prev) => ({ ...prev, selectedPackage: pkg }));
  }, []);

  const setDeliveryFrequency = useCallback((frequency) => {
    setState((prev) => ({ ...prev, deliveryFrequency: frequency }));
  }, []);

  const setDeliveryAddress = useCallback((address) => {
    setState((prev) => ({ ...prev, deliveryAddress: address }));
  }, []);

  const addAddOn = useCallback((item) => {
    setState((prev) => {
      const existing = prev.addOns.find((a) => a.productId === item.productId);

      if (existing) {
        return {
          ...prev,
          addOns: prev.addOns.map((a) =>
            a.productId === item.productId
              ? { ...a, quantity: a.quantity + item.quantity }
              : a,
          ),
        };
      }

      return { ...prev, addOns: [...prev.addOns, item] };
    });
  }, []);

  const removeAddOn = useCallback((itemId) => {
    setState((prev) => ({
      ...prev,
      addOns: prev.addOns.filter((a) => a.id !== itemId),
    }));
  }, []);

  const updateAddOnQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      setState((prev) => ({
        ...prev,
        addOns: prev.addOns.filter((a) => a.id !== itemId),
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      addOns: prev.addOns.map((a) =>
        a.id === itemId ? { ...a, quantity } : a,
      ),
    }));
  }, []);

  // Get monthly subscription price based on delivery frequency
  const getMonthlyTotal = useCallback(() => {
    if (!state.selectedPackage) return 0;

    return state.deliveryFrequency === "weekly"
      ? state.selectedPackage.weeklyDeliveryPrice
      : state.selectedPackage.monthlyDeliveryPrice;
  }, [state.selectedPackage, state.deliveryFrequency]);

  // Get add-ons total (paid separately)
  const getAddOnsTotal = useCallback(() => {
    return state.addOns.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }, [state.addOns]);

  const resetCheckout = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <CheckoutContext.Provider
      value={{
        ...state,
        setPendingPlanChange,
        setStep,
        nextStep,
        prevStep,
        selectPackage,
        setDeliveryFrequency,
        setDeliveryAddress,
        addAddOn,
        removeAddOn,
        updateAddOnQuantity,
        getMonthlyTotal,
        getAddOnsTotal,
        resetCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);

  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }

  return context;
}

export function useCheckoutContext() {
  const context = useContext(CheckoutContext);

  if (!context) {
    throw new Error("useCheckoutContext must be used within a CheckoutProvider");
  }

  return context;
}
