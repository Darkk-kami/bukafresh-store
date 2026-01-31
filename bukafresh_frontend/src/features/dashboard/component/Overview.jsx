import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Truck,
  Calendar,
  CreditCard,
  TrendingUp,
  Clock,
  Leaf,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/shared/ui/buttons";
import { useAuth } from "@/auth/api/AuthProvider";
import { useUserProfile } from "@/auth/api/useUserProfile";
import { useSubscription } from "@/features/subscription/api/useSubscription";

const Overview = () => {
  const { isAuthenticated } = useAuth();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { subscription, isLoading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const stats = [
    {
      label: "Amount spent",
      value: "₦45,000",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      label: "Orders This Month",
      value: "4",
      icon: Package,
      color: "text-blue-600",
    },
    {
      label: "Loyalty Points",
      value: "2,450",
      icon: Leaf,
      color: "text-primary",
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Welcome Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
          Welcome back
          {profileLoading ? "!" : `, ${profile?.data?.firstName || "User"}!`}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Here&apos;s what&apos;s happening with your subscription
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-card rounded-xl sm:rounded-2xl border border-border/50 p-4 sm:p-6"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-muted flex items-center justify-center ${stat.color}`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Current Subscription */}
        <div className="bg-card rounded-xl sm:rounded-2xl border border-border/50 overflow-hidden">
          {subscriptionLoading ? (
            <div className="p-6 animate-pulse">
              <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          ) : subscription ? (
            <>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-xs sm:text-sm font-medium">
                      Current Plan
                    </p>
                    <h2 className="text-lg sm:text-2xl font-display font-bold text-white mt-1">
                      {subscription.planDetails?.name || "Standard Package"}
                    </h2>
                  </div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/20 flex items-center justify-center">
                    <Package className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between py-2 sm:py-3 border-b border-border">
                  <span className="text-muted-foreground text-sm sm:text-base">
                    Monthly Subscription
                  </span>
                  <span className="font-medium text-foreground text-sm sm:text-base">
                    {subscription.planDetails?.price || "₦140,000/month"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 sm:py-3 border-b border-border">
                  <span className="text-muted-foreground text-sm sm:text-base">
                    Delivery Day
                  </span>
                  <span className="font-medium text-foreground text-sm sm:text-base">
                    {subscription.planDetails?.deliveryDay || "Saturday"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 sm:py-3">
                  <span className="text-muted-foreground text-sm sm:text-base">
                    Status
                  </span>
                  <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                    subscription.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                    subscription.status === "PAUSED" ? "bg-yellow-100 text-yellow-700" :
                    subscription.status === "CANCELED" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {subscription.status || "Active"}
                  </span>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-3 sm:mt-4 text-sm sm:text-base"
                  onClick={() => navigate("/dashboard/subscription")}
                >
                  Manage Subscription
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </>
          ) : (
            // No subscription state
            <div className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Active Subscription
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Start your fresh grocery journey today
              </p>
              <Button
                onClick={() => navigate("/dashboard/subscription")}
                className="w-full"
              >
                Choose a Plan
              </Button>
            </div>
          )}
        </div>

        {/* Next Delivery */}
        <div className="bg-card rounded-xl sm:rounded-2xl border border-border/50 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs sm:text-sm font-medium">
                  Next Delivery
                </p>
                <h2 className="text-lg sm:text-2xl font-display font-bold text-white mt-1">
                  Saturday, Jan 31
                </h2>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/20 flex items-center justify-center">
                <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Arriving in
                </p>
                <p className="font-semibold text-foreground text-sm sm:text-base">
                  3 days
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">
                Items in this delivery:
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">
                    Fresh Chicken Breast
                  </span>
                  <span className="text-foreground">2 kg</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Fresh Tomatoes</span>
                  <span className="text-foreground">3 kg</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Ugwu Leaves</span>
                  <span className="text-foreground">4 bunch</span>
                </div>
                <p className="text-xs sm:text-sm text-primary">+1 more items</p>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-4 sm:mt-6 text-sm sm:text-base"
              onClick={() => navigate("/dashboard/deliveries")}
            >
              View All Deliveries
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 sm:mt-8">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
          Quick Actions
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <button
            onClick={() => navigate("/dashboard/shop")}
            className="flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 bg-card rounded-xl sm:rounded-2xl border border-border/50 hover:border-primary/50 transition-colors"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-foreground text-center">
              Add Items
            </span>
          </button>

          <button
            onClick={() => navigate("/dashboard/deliveries")}
            className="flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 bg-card rounded-xl sm:rounded-2xl border border-border/50 hover:border-primary/50 transition-colors"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-orange-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-foreground text-center">
              Reschedule
            </span>
          </button>

          <button
            onClick={() => navigate("/dashboard/subscription")}
            className="flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 bg-card rounded-xl sm:rounded-2xl border border-border/50 hover:border-primary/50 transition-colors"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-100 flex items-center justify-center">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-foreground text-center">
              Pause Plan
            </span>
          </button>

          <button
            onClick={() => navigate("/dashboard/payment")}
            className="flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 bg-card rounded-xl sm:rounded-2xl border border-border/50 hover:border-primary/50 transition-colors"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gray-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-foreground text-center">
              Payment
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;
