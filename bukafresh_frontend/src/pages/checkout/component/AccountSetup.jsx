import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle,
  Phone,
  Loader,
} from "lucide-react";
import { Button } from "@/shared/ui/buttons";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useCheckoutContext } from "@/pages/checkout/context/CheckoutContext";
import { cn } from "@/shared/utils/cn";
import { showErrorAlert, showWarningAlert } from "@/shared/customAlert";

export const AccountSetup = ({ value, onChange, isSubmitting, error, onSubmit }) => {
  const navigate = useNavigate();
  const { deliveryAddress } = useCheckoutContext();
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const formatPhoneNumber = (phoneValue) => {
    const digits = phoneValue.replace(/\D/g, "");
    return digits.slice(0, 11);
  };

  const handlePhoneChange = (e) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    onChange({ ...value, phone: formattedPhone });
  };

  const handleInputChange = (field, inputValue) => {
    onChange({ ...value, [field]: inputValue });
    // Clear local error when user types, but don't trigger validation
    if (localError) {
      setLocalError("");
    }
  };

  const validateForm = () => {
    if (
      !value.firstName?.trim() ||
      !value.lastName?.trim() ||
      !value.email?.trim() ||
      !value.password?.trim() ||
      !value.phone?.trim()
    ) {
      const errorMsg = "Please fill out all the required fields to continue";
      setLocalError(errorMsg);
      showErrorAlert("Almost there!", errorMsg);
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.email)) {
      const errorMsg = "Please check your email address - it doesn't look quite right";
      setLocalError(errorMsg);
      showErrorAlert("Email Issue", errorMsg);
      return false;
    }
    
    if (value.password.length < 6) {
      const errorMsg = "Your password needs to be at least 6 characters long for security";
      setLocalError(errorMsg);
      showErrorAlert("Password Too Short", errorMsg);
      return false;
    }
    
    if (value.phone.length < 11) {
      const errorMsg = "Please enter your complete phone number (should be 11 digits)";
      setLocalError(errorMsg);
      showErrorAlert("Phone Number Incomplete", errorMsg);
      return false;
    }
    
    if (!deliveryAddress) {
      const errorMsg = "We need your delivery address to know where to send your groceries";
      setLocalError(errorMsg);
      showWarningAlert("Delivery Address Missing", errorMsg);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    // Call the parent's submit handler
    if (onSubmit) {
      onSubmit();
    } else {
      showErrorAlert("Something went wrong", "We couldn't create your account right now. Please try again or contact us for help.");
    }
  };

  const displayError = error?.message || localError;

  // Memoized validation check for button state (doesn't trigger re-renders)
  const isFormValid = useMemo(() => {
    return (
      value.firstName?.trim() &&
      value.lastName?.trim() &&
      value.email?.trim() &&
      value.password?.trim() &&
      value.phone?.trim() &&
      value.password.length >= 6 &&
      value.phone.length >= 11 &&
      deliveryAddress &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)
    );
  }, [value, deliveryAddress]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold text-foreground">
          Create Your Account
        </h1>
        <p className="text-muted-foreground mt-2">
          Complete your account setup to finish checkout
        </p>
      </div>

      <div className="max-w-md mx-auto">
        {/* Delivery Address Confirmation */}
        {deliveryAddress && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 space-y-2">
            <p className="text-sm text-muted-foreground">Delivery Address</p>
            <p className="font-semibold text-foreground">
              {deliveryAddress.label || "Delivery Address"}
            </p>
            <p className="text-sm text-muted-foreground">
              {deliveryAddress.street}, {deliveryAddress.city},{" "}
              {deliveryAddress.state}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="firstName"
                  placeholder="John"
                  value={value.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="pl-10"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={value.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="08012345678"
                value={value.phone}
                onChange={handlePhoneChange}
                className="pl-10"
                required
                maxLength={11}
                disabled={isSubmitting}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enter your Nigerian phone number (like 08012345678)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={value.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="pl-10"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Create a secure password (at least 6 characters)"
                value={value.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="pl-10"
                required
                minLength={6}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {displayError && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
              {displayError}
            </div>
          )}

          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full"
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            <strong>Next:</strong> After creating your account, you'll be able to 
            manage your subscription, track deliveries, and customize your packages.
          </p>
        </div>
      </div>
    </div>
  );
};
