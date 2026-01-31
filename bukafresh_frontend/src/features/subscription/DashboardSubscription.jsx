import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Pause,
  Play,
  Calendar,
  CreditCard,
  ChevronRight,
  AlertCircle,
  Check,
  Truck,
} from "lucide-react";
import { Button } from "@/shared/ui/buttons";
import { useSubscription } from "./api/useSubscription";
import { NoActiveSubscription } from "./component/NoActiveSubscription";
import { InactiveSubscription } from "./component/InactiveSubscription";
import { PlanChangeDialog } from "./component/PlanChangeDialog";
import { cn } from "@/shared/utils/cn";

const DashboardSubscription = () => {
  const navigate = useNavigate();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [selectedNewPlan, setSelectedNewPlan] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const {
    subscription,
    allSubscriptions,
    isLoading,
    error,
    isError,
    pauseSubscription,
    resumeSubscription,
    isPausing,
    isResuming,
    createSubscription,
    isCreating,
    deleteSubscription,
    isDeleting,
  } = useSubscription();

  // Check if user has any subscription (active, pending, or inactive)
  const hasAnySubscription = subscription || (allSubscriptions && allSubscriptions.length > 0);
  
  // Get the first subscription if no active subscription but has others
  const currentSubscription = subscription || (allSubscriptions && allSubscriptions.length > 0 ? allSubscriptions[0] : null);
  
  // Determine if we should show no subscription UI
  // Only show NoActiveSubscription if user has NO subscriptions at all
  const showNoSubscription = !hasAnySubscription && 
    (isError && error && (
      error.message?.includes("not found") || 
      error.message?.includes("No subscription found") || 
      error.message?.includes("404")
    ));

  // If not authenticated, show message
  if (!localStorage.getItem("authToken")) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            My Subscription
          </h1>
        </div>
        <div className="bg-card rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Authentication Required
          </h3>
          <p className="text-muted-foreground mb-4">
            Please log in to view your subscription details.
          </p>
          <Button onClick={() => navigate("/login")}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            My Subscription
          </h1>
          <p className="text-muted-foreground mt-1">
            Loading subscription data...
          </p>
        </div>
        <div className="animate-pulse">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
            <div className="h-6 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error only for unexpected errors (not 404/not found)
  if (isError && error && 
      !error.message?.includes("not found") && 
      !error.message?.includes("No subscription found") && 
      !error.message?.includes("404")) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            My Subscription
          </h1>
        </div>
        <div className="bg-card rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Error Loading Subscription
          </h3>
          <p className="text-muted-foreground mb-4">
            {error.message || "Failed to load subscription details"}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Show NoActiveSubscription component when no subscription at all
  if (showNoSubscription) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            My Subscription
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your subscription plan
          </p>
        </div>

        <NoActiveSubscription 
          createSubscription={createSubscription}
          isCreating={isCreating}
        />
      </div>
    );
  }

  // Show InactiveSubscription component when user has inactive/pending subscription
  if (currentSubscription && (currentSubscription.status === "PENDING" || currentSubscription.status === "INACTIVE")) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            My Subscription
          </h1>
          <p className="text-muted-foreground mt-1">
            Complete payment to activate your subscription
          </p>
        </div>

        <InactiveSubscription 
          subscription={currentSubscription}
          onDelete={deleteSubscription}
          isDeleting={isDeleting}
        />
      </div>
    );
  }

  // Mock packages for plan changes
  const mockPackages = [
    {
      id: "ESSENTIALS",
      name: "Essentials",
      servings: "1-2 people",
      weeklyDeliveryPrice: 20000,
      monthlyDeliveryPrice: 80000,
      features: ["Basic vegetables", "Standard delivery", "Email support"],
    },
    {
      id: "STANDARD",
      name: "Standard",
      servings: "2-3 people",
      weeklyDeliveryPrice: 35000,
      monthlyDeliveryPrice: 140000,
      popular: true,
      features: [
        "Fresh vegetables and fruits",
        "Premium quality",
        "Weekly delivery",
        "Customer support",
      ],
    },
    {
      id: "PREMIUM",
      name: "Premium",
      servings: "4-5 people",
      weeklyDeliveryPrice: 50000,
      monthlyDeliveryPrice: 200000,
      features: [
        "Premium vegetables and fruits",
        "Organic options",
        "Priority delivery",
        "24/7 support",
      ],
    },
  ];

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);

  const handlePauseToggle = () => {
    if (currentSubscription?.status === "PAUSED") {
      resumeSubscription(currentSubscription.id);
    } else {
      pauseSubscription(currentSubscription.id);
    }
  };

  const handlePlanSelect = (pkg) => {
    if (pkg.id === currentSubscription?.tier?.toUpperCase()) return;
    setSelectedNewPlan(pkg);
    setShowConfirmDialog(true);
  };

  const handleConfirmPlanChange = () => {
    if (!selectedNewPlan) return;
    setShowConfirmDialog(false);
    navigate("/dashboard/payment");
  };

  // Get current subscription data
  const isPaused = currentSubscription?.status === "PAUSED";
  const isActive = currentSubscription?.status === "ACTIVE" || currentSubscription?.status === "active";
  const currentPrice = currentSubscription?.planDetails?.price || "₦140,000";
  const nextDeliveryDate = currentSubscription?.nextDeliveryDate ? 
    new Date(currentSubscription.nextDeliveryDate) : 
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Render active subscription UI
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          My Subscription
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your subscription plan and preferences
        </p>
      </div>

      {/* Status Alert */}
      {isPaused && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Subscription Paused</p>
            <p className="text-sm text-amber-700">
              Your subscription is currently paused. No deliveries will be
              made until you resume.
            </p>
          </div>
        </div>
      )}

      {/* Current Plan Card */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/80 text-sm font-medium">
                Current Plan
              </p>
              <h2 className="text-2xl font-display font-bold text-primary-foreground mt-1">
                {currentSubscription?.planDetails?.name || currentSubscription?.tier} Package
              </h2>
            </div>
            <div
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                isPaused
                  ? "bg-amber-500 text-white"
                  : isActive
                  ? "bg-green-500 text-white"
                  : "bg-gray-500 text-white",
              )}
            >
              {currentSubscription?.status?.toUpperCase() || "Unknown"}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Plan Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="font-medium text-foreground">
                  {currentSubscription?.tier?.charAt(0).toUpperCase() + currentSubscription?.tier?.slice(1).toLowerCase() || "Standard"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Billing</p>
                <p className="font-medium text-foreground capitalize">
                  {currentSubscription?.billingCycle?.toLowerCase() || "Monthly"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-medium text-foreground">
                  {currentPrice}
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <p className="text-sm font-medium text-foreground mb-3">
              What's Included:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {(currentSubscription?.planDetails?.features || [
                "Fresh vegetables and fruits",
                "Premium quality ingredients", 
                "Weekly delivery",
                "Flexible scheduling",
                "Customer support"
              ]).map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
            <Button
              variant={isPaused ? "default" : "outline"}
              onClick={handlePauseToggle}
              disabled={isPausing || isResuming}
            >
              {isPausing || isResuming ? (
                "Processing..."
              ) : isPaused ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Resume Subscription
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause Subscription
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowUpgrade(!showUpgrade)}
            >
              <Package className="w-4 h-4 mr-2" />
              {showUpgrade ? "Hide Plans" : "Change Plan"}
            </Button>
          </div>
        </div>
      </div>

      {/* Upgrade Options */}
      {showUpgrade && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Available Plans
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockPackages.map((pkg) => {
              const isCurrent = pkg.id === currentSubscription?.tier?.toUpperCase();
              const price = pkg.monthlyDeliveryPrice;

              return (
                <div
                  key={pkg.id}
                  className={cn(
                    "rounded-xl border p-5 transition-all",
                    isCurrent
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/50",
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {pkg.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {pkg.servings}
                      </p>
                    </div>
                    {isCurrent && (
                      <span className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded-full">
                        Current
                      </span>
                    )}
                    {pkg.popular && !isCurrent && (
                      <span className="text-xs px-2 py-1 bg-accent text-accent-foreground rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-4">
                    {formatPrice(price)}
                    <span className="text-sm font-normal text-muted-foreground">
                      /month
                    </span>
                  </p>

                  {/* Package Features */}
                  <ul className="space-y-2 mb-4">
                    {pkg.features.slice(0, 5).map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                    {pkg.features.length > 5 && (
                      <li className="text-sm text-primary font-medium">
                        +{pkg.features.length - 5} more
                      </li>
                    )}
                  </ul>

                  <Button
                    variant={isCurrent ? "outline" : "default"}
                    className="w-full"
                    disabled={isCurrent}
                    onClick={() => handlePlanSelect(pkg)}
                  >
                    {isCurrent ? "Current Plan" : "Switch to this Plan"}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delivery Schedule */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Delivery Schedule
          </h3>
          <Button variant="ghost" size="sm">
            Change Day
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/50 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground capitalize">
              Every {currentSubscription?.planDetails?.deliveryDay || "Saturday"}
            </p>
            <p className="text-sm text-muted-foreground">
              Next delivery:{" "}
              {nextDeliveryDate.toLocaleDateString("en-NG", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Cancel Section */}
      <div className="bg-muted/50 rounded-xl p-6">
        <h3 className="font-medium text-foreground mb-2">Need to Cancel?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          We'd hate to see you go! If you're having issues, please contact our
          support team first.
        </p>
        <Button
          variant="outline"
          className="text-destructive hover:text-destructive"
        >
          Cancel Subscription
        </Button>
      </div>

      {/* Plan Change Confirmation Dialog */}
      {selectedNewPlan && (
        <PlanChangeDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          currentPlan={currentSubscription?.planDetails || { name: currentSubscription?.tier }}
          newPlan={selectedNewPlan}
          deliveryFrequency={currentSubscription?.billingCycle || "MONTHLY"}
          nextBillingDate={currentSubscription?.nextBillingDate}
          onConfirm={handleConfirmPlanChange}
        />
      )}
    </div>
  );
};

export default DashboardSubscription;