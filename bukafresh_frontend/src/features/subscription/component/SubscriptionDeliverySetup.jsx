import { useState } from "react";
import { MapPin, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/buttons";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useSubscriptionCreationContext } from "../context/SubscriptionCreationContext";
import { cn } from "@/shared/utils/cn";
import { showSuccessAlert, showErrorAlert } from "@/shared/customAlert";

export const SubscriptionDeliverySetup = ({ onBack, onContinue, isCreating }) => {
  const { deliveryAddress, setDeliveryAddress } = useSubscriptionCreationContext();

  const [newAddress, setNewAddress] = useState({
    label: "",
    street: "",
    city: "Lagos",
    state: "Lagos",
    postalCode: "",
    instructions: "",
  });

  // Auto-validate and set address when form changes
  const handleAddressChange = (field, value) => {
    const updatedAddress = { ...newAddress, [field]: value };
    setNewAddress(updatedAddress);

    // Auto-set delivery address if required fields are filled
    if (updatedAddress.street?.trim() && updatedAddress.city?.trim()) {
      const address = {
        id: `addr-${Date.now()}`,
        label: updatedAddress.label || "Delivery Address",
        street: updatedAddress.street,
        city: updatedAddress.city,
        state: updatedAddress.state || "Lagos",
        postalCode: updatedAddress.postalCode || "",
        isDefault: false,
        instructions: updatedAddress.instructions,
      };
      setDeliveryAddress(address);
    } else {
      // Clear delivery address if required fields are empty
      setDeliveryAddress(null);
    }
  };

  const handleContinue = () => {
    if (!deliveryAddress && (!newAddress.street?.trim() || !newAddress.city?.trim())) {
      showErrorAlert("Address Required", "Please enter your street address and city");
      return;
    }
    onContinue?.();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Delivery Details</h2>
          <p className="text-muted-foreground">
            Where should we deliver your groceries?
          </p>
        </div>
      </div>

      {/* Saved Addresses */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Delivery Address
        </h3>

        {/* New Address Form */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h4 className="font-medium text-foreground">
              Enter Delivery Address
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="label">Address Label</Label>
                <Input
                  id="label"
                  placeholder="e.g., Home, Office"
                  value={newAddress.label}
                  onChange={(e) => handleAddressChange('label', e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  placeholder="Enter your street address"
                  value={newAddress.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="Lagos"
                  value={newAddress.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  placeholder="101233"
                  value={newAddress.postalCode}
                  onChange={(e) => handleAddressChange('postalCode', e.target.value)}
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
                  onChange={(e) => handleAddressChange('instructions', e.target.value)}
                />
              </div>
            </div>

            {/* Show address preview if valid */}
            {deliveryAddress && (
              <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span className="text-primary font-medium">Address Ready:</span>
                  <span className="text-foreground">
                    {deliveryAddress.street}, {deliveryAddress.city}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

      {/* Delivery Day Notice */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Delivery Day</h3>

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

      {/* Continue Button */}
      <div className="flex justify-center pt-4">
        <Button
          variant="default"
          size="lg"
          onClick={handleContinue}
          disabled={!deliveryAddress || isCreating}
        >
          {isCreating ? 'Creating Subscription...' : 'Create Subscription'}
        </Button>
      </div>
    </div>
  );
};