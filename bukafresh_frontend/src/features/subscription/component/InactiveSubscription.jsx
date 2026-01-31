import { useNavigate } from 'react-router-dom';
import {
  Clock,
  CreditCard,
  Trash2,
  AlertCircle,
  Package,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/shared/ui/buttons';
import { showConfirmAlert } from '@/shared/customAlert';
import { cn } from '@/shared/utils/cn';

export function InactiveSubscription({ subscription, onDelete, isDeleting }) {
  const navigate = useNavigate();

  const handlePayNow = () => {
    navigate('/dashboard/payment', {
      state: {
        subscriptionId: subscription.id,
        subscriptionData: subscription,
        fromInactiveSubscription: true
      }
    });
  };

  const handleDelete = async () => {
    const confirmed = await showConfirmAlert(
      'Delete Subscription',
      'Are you sure you want to delete this subscription? This action cannot be undone.',
      'Delete',
      'Cancel'
    );
    
    if (confirmed) {
      onDelete(subscription.id);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'PAUSED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'INACTIVE':
        return <AlertCircle className="w-4 h-4" />;
      case 'PAUSED':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 mb-6">
          <Package className="w-10 h-10 text-amber-600" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Subscription Needs Payment
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          You have an inactive subscription that needs payment to be activated.
        </p>
      </div>

      {/* Subscription Card */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">
                Your Subscription
              </p>
              <h2 className="text-2xl font-display font-bold text-white mt-1">
                {subscription?.planDetails?.name || subscription?.tier} Package
              </h2>
            </div>
            <div
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1",
                getStatusColor(subscription?.status)
              )}
            >
              {getStatusIcon(subscription?.status)}
              {subscription?.status?.toUpperCase() || "INACTIVE"}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Subscription Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="font-medium text-foreground">
                  {subscription?.tier?.charAt(0).toUpperCase() + subscription?.tier?.slice(1).toLowerCase() || "Standard"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Billing</p>
                <p className="font-medium text-foreground capitalize">
                  {subscription?.billingCycle?.toLowerCase() || "Monthly"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-medium text-foreground">
                  {subscription?.planDetails?.price || "₦140,000"}
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
              {(subscription?.planDetails?.features || [
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
                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button
              className="flex-1"
              onClick={handlePayNow}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Pay Now - {subscription?.planDetails?.price || "₦140,000"}
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-destructive hover:text-destructive border-destructive/20 hover:border-destructive/50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete Subscription"}
            </Button>
          </div>
        </div>
      </div>

      {/* Information Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800 mb-1">Payment Required</p>
            <p className="text-sm text-blue-700">
              Your subscription is currently inactive and requires payment to start receiving deliveries. 
              You can pay now to activate it or delete it if you no longer want this subscription.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}