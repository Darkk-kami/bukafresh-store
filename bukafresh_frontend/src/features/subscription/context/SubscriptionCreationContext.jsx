import { createContext, useContext, useState } from 'react';

const SubscriptionCreationContext = createContext();

export function SubscriptionCreationProvider({ children }) {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [deliveryFrequency, setDeliveryFrequency] = useState('monthly');
  const [deliveryAddress, setDeliveryAddress] = useState(null);

  const selectPackage = (pkg) => {
    setSelectedPackage(pkg);
  };

  const value = {
    selectedPackage,
    selectPackage,
    deliveryFrequency,
    setDeliveryFrequency,
    deliveryAddress,
    setDeliveryAddress,
  };

  return (
    <SubscriptionCreationContext.Provider value={value}>
      {children}
    </SubscriptionCreationContext.Provider>
  );
}

export function useSubscriptionCreationContext() {
  const context = useContext(SubscriptionCreationContext);
  if (!context) {
    throw new Error('useSubscriptionCreationContext must be used within a SubscriptionCreationProvider');
  }
  return context;
}