import { Button } from "@/shared/ui/buttons";
import { AlertCircle } from "lucide-react";

// Simple dialog component since we don't have the full dialog system
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const DialogHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

const DialogTitle = ({ children }) => (
  <h2 className="text-lg font-semibold">{children}</h2>
);

const DialogDescription = ({ children }) => (
  <p className="text-sm text-muted-foreground">{children}</p>
);

export const PlanChangeDialog = ({
  open,
  onOpenChange,
  currentPlan,
  newPlan,
  deliveryFrequency,
  nextBillingDate,
  onConfirm,
}) => {
  const getCurrentPrice = () =>
    deliveryFrequency === "weekly"
      ? currentPlan.weeklyDeliveryPrice
      : currentPlan.monthlyDeliveryPrice;

  const getNewPrice = () =>
    deliveryFrequency === "weekly"
      ? newPlan.weeklyDeliveryPrice
      : newPlan.monthlyDeliveryPrice;

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);

  const currentPrice = getCurrentPrice();
  const newPrice = getNewPrice();
  const priceDifference = newPrice - currentPrice;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Plan Change</DialogTitle>
          <DialogDescription>
            Review the changes to your subscription plan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>
              Your new plan will take effect on{" "}
              <strong>{nextBillingDate}</strong>
            </span>
          </div>

          <div className="space-y-3 rounded-lg border p-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Current Plan:</span>
              <span className="font-medium">{currentPlan.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">New Plan:</span>
              <span className="font-medium text-green-600">{newPlan.name}</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Current Price:</span>
                <span>{formatPrice(currentPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">New Price:</span>
                <span className="font-medium">{formatPrice(newPrice)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold pt-2 border-t">
                <span>Price Difference:</span>
                <span
                  className={
                    priceDifference > 0 ? "text-green-600" : "text-red-600"
                  }
                >
                  {priceDifference > 0 ? "+" : ""}
                  {formatPrice(priceDifference)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={onConfirm} className="flex-1">
              Confirm Change
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
