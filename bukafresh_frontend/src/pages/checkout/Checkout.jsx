import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/shared/ui/buttons";
import { useCheckoutContext } from "@/pages/checkout/context/CheckoutContext";
import { PackageSelection } from "@/pages/checkout/component/PackageSelection";
import { DeliverySetup } from "@/pages/checkout/component/DeliverySetup";
import { AccountSetup } from "@/pages/checkout/component/AccountSetup";
import { CheckoutSuccess } from "@/pages/checkout/component/CheckoutSuccess";
import { mockPackages } from "@/data/mockProducts";
import { cn } from "@/shared/utils/cn";
import { useCheckoutRegister } from "@/pages/checkout/api/useCheckoutRegister";
import {
  showSuccessAlert,
  showErrorAlert,
  showInfoAlert,
} from "@/shared/customAlert";

const steps = [
  { number: 1, label: "Package" },
  { number: 2, label: "Delivery" },
  { number: 3, label: "Account" },
];

const Checkout = () => {
  const {
    step,
    setStep,
    selectedPackage,
    selectPackage,
    deliveryAddress,
    prevStep,
    nextStep,
  } = useCheckoutContext();

  const [searchParams] = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Account form state (Step 3)
  const [accountData, setAccountData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });

  // React Query mutation
  const { mutate, isLoading, error } = useCheckoutRegister();

  // Pre-select package from URL
  useEffect(() => {
    const packageParam = searchParams.get("package");

    if (packageParam && !selectedPackage) {
      const matchedPackage = mockPackages.find(
        (pkg) => pkg.name.toLowerCase() === packageParam.toLowerCase(),
      );

      if (matchedPackage) {
        selectPackage(matchedPackage);
      }
    }
  }, [searchParams, selectedPackage, selectPackage]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!selectedPackage;
      case 2:
        return !!deliveryAddress;
      case 3:
        return (
          accountData.firstName &&
          accountData.lastName &&
          accountData.email &&
          accountData.password
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step === 3) {
      // Show info alert that we're processing
      showInfoAlert("Creating your account", "This will just take a moment...");

      // Format payload according to the required structure
      const payload = {
        firstName: accountData.firstName,
        lastName: accountData.lastName,
        email: accountData.email,
        password: accountData.password,
        phone: accountData.phone,
        deliveryAddress: {
          type: deliveryAddress?.label || "home",
          street: deliveryAddress?.street || "",
          city: deliveryAddress?.city || "",
          state: deliveryAddress?.state || "",
          postalCode:
            deliveryAddress?.postalCode || deliveryAddress?.postalcode || "",
        },
      };

      mutate(payload, {
        onSuccess: (data) => {
          if (data.success) {
            showSuccessAlert("Welcome to BukaFresh! 🎉", data.message);
            setSuccessMessage(data.message);
            setIsSuccess(true);
          } else {
            showErrorAlert(
              "Couldn't create account",
              data.message ||
                "Something went wrong. Please try again or contact our support team.",
            );
          }
        },
        onError: (error) => {
          let errorMessage =
            "We're having trouble connecting right now. Please check your internet and try again.";

          // Make error messages more user-friendly
          if (error.message?.includes("email")) {
            errorMessage =
              "This email address is already registered. Try logging in instead, or use a different email.";
          } else if (error.message?.includes("phone")) {
            errorMessage =
              "This phone number is already registered. Please use a different number or contact support.";
          } else if (
            error.message?.includes("network") ||
            error.message?.includes("fetch")
          ) {
            errorMessage =
              "Connection problem - please check your internet and try again.";
          } else if (error.message?.includes("timeout")) {
            errorMessage =
              "This is taking longer than usual. Please try again.";
          }

          showErrorAlert("Connection trouble", errorMessage);
        },
      });
      return;
    }

    nextStep();
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <PackageSelection />;
      case 2:
        return <DeliverySetup />;
      case 3:
        return (
          <AccountSetup
            value={accountData}
            onChange={setAccountData}
            isSubmitting={isLoading}
            error={error}
            onSubmit={handleNext}
          />
        );
      default:
        return null;
    }
  };

  // Show success page if registration was successful
  if (isSuccess) {
    return (
      <CheckoutSuccess
        userEmail={accountData.email}
        successMessage={successMessage}
      />
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold">
                Buka<span className="text-primary">Fresh</span>
              </span>
            </Link>

            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <button
                  onClick={() => s.number < step && setStep(s.number)}
                  disabled={s.number > step}
                  className={cn(
                    "flex flex-col items-center gap-2 transition-all",
                    s.number <= step
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50",
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold transition-all text-sm",
                      s.number < step
                        ? "bg-primary text-primary-foreground"
                        : s.number === step
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {s.number < step ? <Check className="w-4 h-4" /> : s.number}
                  </div>

                  <span
                    className={cn(
                      "text-xs font-medium hidden sm:block",
                      s.number <= step
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {s.label}
                  </span>
                </button>

                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-12 sm:w-20 h-1 mx-2 rounded-full",
                      s.number < step ? "bg-primary" : "bg-muted",
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">{renderStepContent()}</div>

        {/* Navigation Buttons */}
        {step !== 3 && (
          <div className="max-w-4xl mx-auto mt-8">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1 || isLoading}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              <Button
                variant="hero"
                onClick={handleNext}
                disabled={!canProceed() || isLoading}
                className="gap-2"
              >
                {isLoading ? "Submitting…" : "Continue"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
