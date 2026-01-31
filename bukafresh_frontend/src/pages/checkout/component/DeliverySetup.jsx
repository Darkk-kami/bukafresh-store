import { useState } from "react";
import { MapPin, Plus, Check } from "lucide-react";
import { Button } from "@/shared/ui/buttons";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useCheckoutContext } from "@/pages/checkout/context/CheckoutContext";
// import { useAuthContext } from "@/features/auth/store/AuthContext";
// import { mockAddresses } from "@/data/mockUser";
import { cn } from "@/shared/utils/cn";
import { showSuccessAlert, showErrorAlert } from "@/shared/customAlert";

export const DeliverySetup = () => {
  const { deliveryAddress, setDeliveryAddress } = useCheckoutContext();
  // const { isAuthenticated } = useAuthContext();
  const isAuthenticated = false; // For now, assume guest checkout

  // For guests, show the form by default since they have no saved addresses
  const [showNewAddress, setShowNewAddress] = useState(!isAuthenticated);
  const [newAddress, setNewAddress] = useState({
    label: "",
    street: "",
    city: "Lagos",
    state: "Lagos",
    postalCode: "",
    instructions: "",
  });

  // Only show saved addresses for authenticated users
  // const savedAddresses = isAuthenticated ? mockAddresses : [];
  const savedAddresses = [];

  const handleSelectAddress = (address) => {
    setDeliveryAddress(address);
    setShowNewAddress(false);
  };

  const handleAddNewAddress = () => {
    if (!newAddress.street?.trim()) {
      showErrorAlert("Street address needed", "Please tell us your street address so we know where to deliver");
      return;
    }
    
    if (!newAddress.city?.trim()) {
      showErrorAlert("City needed", "Please let us know which city you're in");
      return;
    }

    const address = {
      id: `addr-${Date.now()}`,
      label: newAddress.label || "New Address",
      street: newAddress.street,
      city: newAddress.city,
      state: newAddress.state || "Lagos",
      postalCode: newAddress.postalCode || "",
      isDefault: false,
      instructions: newAddress.instructions,
    };

    setDeliveryAddress(address);
    setShowNewAddress(false);
    showSuccessAlert("Address saved! ✓", "We've got your delivery address ready");
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold text-foreground">
          Delivery Details
        </h1>
        <p className="text-muted-foreground mt-2">
          Where should we deliver your groceries?
        </p>
      </div>

      {/* Saved Addresses */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Delivery Address
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedAddresses.map((address) => {
            const isSelected = deliveryAddress?.id === address.id;

            return (
              <button
                key={address.id}
                onClick={() => handleSelectAddress(address)}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 bg-card",
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                  )}
                >
                  <MapPin className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {address.label}
                    </span>

                    {address.isDefault && (
                      <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                        Default
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {address.street}, {address.city}
                  </p>
                </div>

                {isSelected && (
                  <Check className="w-5 h-5 text-primary shrink-0" />
                )}
              </button>
            );
          })}

          {/* Add New Address Button */}
          {savedAddresses.length > 0 && (
            <button
              onClick={() => setShowNewAddress(true)}
              className={cn(
                "flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed transition-all",
                showNewAddress
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50",
              )}
            >
              <Plus className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">Add New Address</span>
            </button>
          )}
        </div>

        {/* New Address Form */}
        {(showNewAddress || savedAddresses.length === 0) && (
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="font-medium text-foreground">
              {savedAddresses.length === 0
                ? "Enter Delivery Address"
                : "New Delivery Address"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="label">Address Label</Label>
                <Input
                  id="label"
                  placeholder="e.g., Home, Office"
                  value={newAddress.label}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, label: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  placeholder="Enter your street address"
                  value={newAddress.street}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, street: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="Lagos"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  placeholder="101233"
                  value={newAddress.postalCode}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      postalCode: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="instructions">
                  Delivery Instructions (Optional)
                </Label>
                <Input
                  id="instructions"
                  placeholder="e.g., Call when at the gate"
                  value={newAddress.instructions}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      instructions: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              {savedAddresses.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setShowNewAddress(false)}
                >
                  Cancel
                </Button>
              )}

              <Button variant="hero" onClick={handleAddNewAddress}>
                {savedAddresses.length === 0 ? "Continue" : "Save Address"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delivery Day Notice */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Delivery Day</h2>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="text-xl">📅</span>
          </div>
          <div>
            <p className="font-semibold text-foreground">Every Saturday</p>
            <p className="text-sm text-muted-foreground">
              All deliveries are made on Saturdays between 8am - 6pm
            </p>
          </div>
        </div>
      </div>

      {/* Coverage Notice */}
      <div className="bg-accent/30 rounded-xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
          <MapPin className="w-4 h-4 text-accent-foreground" />
        </div>
        <div>
          <p className="font-medium text-foreground">Delivery Coverage</p>
          <p className="text-sm text-muted-foreground mt-1">
            We currently deliver within Lagos mainland and island areas.
            Delivery is free for all subscription orders!
          </p>
        </div>
      </div>
    </div>
  );
};
