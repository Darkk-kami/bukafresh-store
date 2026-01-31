import {
  Check,
  Truck,
  Calendar,
  Info,
  Star,
  ShoppingBasket,
  Crown,
} from "lucide-react";
import { useSubscriptionCreationContext } from "../context/SubscriptionCreationContext";
import { mockPackages } from "@/data/mockProducts";
import { cn } from "@/shared/utils/cn";
import { Button } from "@/shared/ui/buttons";
import { showSuccessAlert, showInfoAlert } from "@/shared/customAlert";

const packageIcons = {
  single: ShoppingBasket,
  couple: Star,
  premium: Crown,
};

export const SubscriptionPackageSelection = ({ onContinue }) => {
  const {
    selectedPackage,
    selectPackage,
    deliveryFrequency,
    setDeliveryFrequency,
  } = useSubscriptionCreationContext();

  const handleSelect = (pkg) => {
    selectPackage(pkg);
    showSuccessAlert("Great choice! ✓", `${pkg.name} package selected - perfect for your needs`);
  };

  const handleContinue = () => {
    if (!selectedPackage) {
      showErrorAlert("Package Required", "Please select a subscription package to continue");
      return;
    }
    onContinue?.();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold text-foreground">
          Choose Your Package
        </h2>
        <p className="text-muted-foreground mt-2">
          Select the perfect plan for your household
        </p>
      </div>

      {/* Delivery Frequency Toggle */}
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="inline-flex items-center bg-muted rounded-full p-1">
            <button
              onClick={() => {
                setDeliveryFrequency("weekly");
                showInfoAlert("Weekly delivery chosen", "You'll get fresh fruits and vegetables every week");
              }}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all",
                deliveryFrequency === "weekly"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Truck className="w-4 h-4" />
              Weekly Delivery
            </button>

            <button
              onClick={() => {
                setDeliveryFrequency("monthly");
                showInfoAlert("Monthly delivery chosen", "Great value option - perfect for pantry staples");
              }}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all",
                deliveryFrequency === "monthly"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Calendar className="w-4 h-4" />
              Monthly Delivery
            </button>
          </div>
        </div>

        {/* Frequency Info */}
        <div className="flex justify-center">
          <div
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm",
              deliveryFrequency === "weekly"
                ? "bg-primary/10 text-primary"
                : "bg-green-100 text-green-700",
            )}
          >
            <Info className="w-4 h-4" />
            {deliveryFrequency === "weekly"
              ? "Get fresh goods like fruits & vegetables every week"
              : "Lower price - Great for non-perishables"}
          </div>
        </div>

        {/* Billing Note */}
        <p className="text-center text-sm text-muted-foreground">
          All subscriptions are billed monthly
        </p>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockPackages.map((pkg) => {
          const Icon = packageIcons[pkg.type] || ShoppingBasket;
          const isSelected = selectedPackage?.id === pkg.id;
          const price =
            deliveryFrequency === "weekly"
              ? pkg.weeklyDeliveryPrice
              : pkg.monthlyDeliveryPrice;

          return (
            <div
              key={pkg.id}
              onClick={() => handleSelect(pkg)}
              className={cn(
                "relative flex flex-col p-6 rounded-2xl border-2 text-left transition-all cursor-pointer",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 bg-card",
                pkg.popular && "ring-2 ring-accent ring-offset-2",
              )}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full">
                  Most Popular
                </span>
              )}

              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}

              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>

              <h3 className="text-xl font-display font-bold text-foreground">
                {pkg.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {pkg.description}
              </p>
              <p className="text-xs text-primary mt-1">{pkg.servings}</p>

              <div className="mt-4">
                <span className="text-2xl font-bold text-foreground">
                  {formatPrice(price)}
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <ul className="mt-4 space-y-2 flex-1">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={isSelected ? "hero" : "outline"}
                className="w-full mt-6"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(pkg);
                }}
              >
                {isSelected ? "Selected" : "Select Plan"}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="flex justify-center pt-4">
        <Button
          variant="default"
          size="lg"
          disabled={!selectedPackage}
          onClick={handleContinue}
        >
          Continue to Address
        </Button>
      </div>
    </div>
  );
};