import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  CreditCard, 
  DollarSign, 
  Clock, 
  AlertCircle,
  ArrowLeft,
  Building2,
  Phone,
  User,
  Hash
} from "lucide-react";
import { Button } from "@/shared/ui/buttons";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useSubscription } from "@/features/subscription/api/useSubscription";
import { usePayment } from "@/features/payment/api/usePayment";
import { useUserProfile } from "@/auth/api/useUserProfile";
import { nigerianBanks } from "@/data/mockProducts";
import { cn } from "@/shared/utils/cn";
import { showErrorAlert, showConfirmAlert } from "@/shared/customAlert";

const DashboardPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { subscription, allSubscriptions, isLoading, deleteSubscription, isDeleting } = useSubscription();
  const { processPayment, isProcessingPayment } = usePayment();
  const { data: profile, isLoading: isLoadingProfile } = useUserProfile();
  
  // Extract profile data from API response structure
  const profileData = profile?.data;

  // Get subscription data from navigation state (for pending subscriptions)
  const { subscriptionData } = location.state || {};
  
  // Use subscription from state if available, otherwise use current subscription
  const currentSubscription = subscriptionData || subscription;
  const isPendingPayment = currentSubscription?.status === "PENDING";

  // Get all pending/inactive subscriptions that need payment
  const pendingSubscriptions = allSubscriptions?.filter(sub => 
    sub.status === "PENDING" || sub.status === "INACTIVE"
  ) || [];

  // Selected subscription for payment (from navigation state or first pending)
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  useEffect(() => {
    // Set selected subscription from navigation state or first pending subscription
    if (subscriptionData) {
      setSelectedSubscription(subscriptionData);
    } else if (pendingSubscriptions.length > 0) {
      setSelectedSubscription(pendingSubscriptions[0]);
    }
  }, [subscriptionData, pendingSubscriptions]);

  // Payment form state (firstName and lastName will come from profile)
  const [paymentForm, setPaymentForm] = useState({
    bvn: "",
    accountNumber: "",
    bankName: "",
    phoneNumber: "",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // Pre-fill form with profile data
    if (profileData) {
      setPaymentForm(prev => ({
        ...prev,
        phoneNumber: profileData.phone || prev.phoneNumber,
      }));
    }
  }, [profileData]);

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!paymentForm.bvn || paymentForm.bvn.length !== 11) {
      errors.bvn = "BVN must be exactly 11 digits";
    }

    if (!paymentForm.accountNumber || paymentForm.accountNumber.length !== 10) {
      errors.accountNumber = "Account number must be exactly 10 digits";
    }

    if (!paymentForm.bankName) {
      errors.bankName = "Please select your bank";
    }

    if (!paymentForm.phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    }

    if (!profileData?.firstName) {
      errors.firstName = "First name not found in profile";
    }

    if (!profileData?.lastName) {
      errors.lastName = "Last name not found in profile";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setPaymentForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handlePaymentSubmit = async () => {
    if (!profileData?.firstName || !profileData?.lastName) {
      showErrorAlert("Profile Incomplete", "Please complete your profile with first name and last name before making payment.");
      return;
    }

    if (!validateForm()) {
      showErrorAlert("Form Validation", "Please fill in all required fields correctly");
      return;
    }

    if (!selectedSubscription?.id) {
      showErrorAlert("Subscription Error", "No subscription found to process payment for");
      return;
    }

    const paymentData = {
      subscriptionId: selectedSubscription.id,
      bvn: paymentForm.bvn,
      accountNumber: paymentForm.accountNumber,
      bankName: paymentForm.bankName,
      phoneNumber: paymentForm.phoneNumber,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
    };

    try {
      await processPayment(paymentData);
      // Success is handled by the mutation's onSuccess callback
      // Navigate back to subscription page
      navigate('/dashboard/subscription');
    } catch (error) {
      // Error is handled by the mutation's onError callback
    }
  };

  const handleBackToSubscription = () => {
    navigate('/dashboard/subscription');
  };

  const handleDeleteSubscription = async (subscriptionId) => {
    const confirmed = await showConfirmAlert(
      'Delete Subscription',
      'Are you sure you want to delete this subscription? This action cannot be undone.',
      'Delete',
      'Cancel'
    );
    
    if (confirmed) {
      deleteSubscription(subscriptionId);
      // After deletion, navigate back to subscription page
      setTimeout(() => {
        navigate('/dashboard/subscription');
      }, 1000);
    }
  };

  // Show pending payment UI if subscription needs payment or there are pending subscriptions
  if (isPendingPayment || pendingSubscriptions.length > 0) {
    // If no selected subscription and no pending subscriptions, show message
    if (!selectedSubscription && pendingSubscriptions.length === 0) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBackToSubscription}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                Payment
              </h1>
              <p className="text-muted-foreground mt-1">
                No pending subscriptions found
              </p>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border/50 p-6 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Pending Payments
            </h3>
            <p className="text-muted-foreground mb-4">
              You don't have any subscriptions that require payment at this time.
            </p>
            <Button onClick={handleBackToSubscription}>
              Back to Subscriptions
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBackToSubscription}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Complete Your Payment
            </h1>
            <p className="text-muted-foreground mt-1">
              {selectedSubscription ? 
                `Activate your ${selectedSubscription.tier} subscription` :
                "Select a subscription to activate"
              }
            </p>
          </div>
        </div>

        {/* Pending Subscriptions List (if multiple) */}
        {pendingSubscriptions.length > 1 && (
          <div className="bg-card rounded-xl border border-border/50 p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Pending Subscriptions
            </h2>
            <div className="space-y-3">
              {pendingSubscriptions.map((sub) => (
                <div 
                  key={sub.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors",
                    selectedSubscription?.id === sub.id 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => setSelectedSubscription(sub)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div>
                      <p className="font-medium text-foreground">
                        {sub.planDetails?.name || sub.tier} Package
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {sub.billingCycle?.toLowerCase()} billing • Created {new Date(sub.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-foreground">
                      {sub.planDetails?.price || "₦140,000"}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSubscription(sub.id);
                      }}
                      disabled={isDeleting}
                      className="text-destructive hover:text-destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Subscription Summary */}
        {selectedSubscription && (
          <div className="bg-card rounded-xl border border-border/50 p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Subscription Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Plan</p>
              <p className="text-lg font-semibold text-foreground">
                {selectedSubscription.planDetails?.name || selectedSubscription.tier}
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-xl font-bold text-foreground">
                {selectedSubscription.planDetails?.price || "₦140,000"}
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Billing Cycle</p>
              <p className="text-lg font-semibold text-foreground capitalize">
                {selectedSubscription.billingCycle?.toLowerCase() || "Monthly"}
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Status</p>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                <Clock className="w-4 h-4" />
                Pending Payment
              </span>
            </div>
          </div>
        </div>
        )}

        {/* Direct Debit Payment Form */}
        {selectedSubscription && (
          <div className="bg-card rounded-xl border border-border/50 p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Bank Account Details
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Enter your bank account details for direct debit payment
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* BVN */}
            <div className="space-y-2">
              <Label htmlFor="bvn">
                <Hash className="w-4 h-4 inline mr-1" />
                BVN *
              </Label>
              <Input
                id="bvn"
                type="text"
                placeholder="Enter your 11-digit BVN"
                value={paymentForm.bvn}
                onChange={(e) => handleInputChange('bvn', e.target.value.replace(/\D/g, '').slice(0, 11))}
                className={formErrors.bvn ? "border-red-500" : ""}
              />
              {formErrors.bvn && (
                <p className="text-sm text-red-500">{formErrors.bvn}</p>
              )}
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <Label htmlFor="accountNumber">
                <CreditCard className="w-4 h-4 inline mr-1" />
                Account Number *
              </Label>
              <Input
                id="accountNumber"
                type="text"
                placeholder="Enter your 10-digit account number"
                value={paymentForm.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                className={formErrors.accountNumber ? "border-red-500" : ""}
              />
              {formErrors.accountNumber && (
                <p className="text-sm text-red-500">{formErrors.accountNumber}</p>
              )}
            </div>

            {/* Bank Name */}
            <div className="space-y-2">
              <Label htmlFor="bankName">
                <Building2 className="w-4 h-4 inline mr-1" />
                Bank Name *
              </Label>
              <select
                id="bankName"
                value={paymentForm.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                className={cn(
                  "w-full px-3 py-2 border rounded-md bg-background",
                  formErrors.bankName ? "border-red-500" : "border-border"
                )}
              >
                <option value="">Select your bank</option>
                {nigerianBanks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
              {formErrors.bankName && (
                <p className="text-sm text-red-500">{formErrors.bankName}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number *
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="e.g., +2348012345678 or 08012345678"
                value={paymentForm.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className={formErrors.phoneNumber ? "border-red-500" : ""}
              />
              <p className="text-xs text-muted-foreground">
                Enter Nigerian phone number with (+234) or without (0) country code
              </p>
              {formErrors.phoneNumber && (
                <p className="text-sm text-red-500">{formErrors.phoneNumber}</p>
              )}
            </div>
          </div>

          {/* Profile Information Display */}
          <div className="bg-muted/30 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-foreground mb-3">Account Holder Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">First Name:</span>
                <span className="text-sm font-medium text-foreground">
                  {profileData?.firstName || "Not available"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Last Name:</span>
                <span className="text-sm font-medium text-foreground">
                  {profileData?.lastName || "Not available"}
                </span>
              </div>
            </div>
            {(!profileData?.firstName || !profileData?.lastName) && (
              <p className="text-sm text-amber-600 mt-2">
                Please update your profile with complete name information before proceeding.
              </p>
            )}
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Secure Payment</p>
                <p className="text-sm text-blue-700 mt-1">
                  Your bank details are encrypted and secure. We use bank-grade security to protect your information.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              className="flex-1"
              onClick={handlePaymentSubmit}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay {selectedSubscription.planDetails?.price || "₦140,000"}
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleBackToSubscription}>
              Cancel
            </Button>
          </div>
        </div>
        )}
      </div>
    );
  }

  // Show loading state
  if (isLoading || isLoadingProfile) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="bg-card rounded-xl p-6 space-y-4">
            <div className="h-6 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
          Payment & Billing
        </h1>
        <p className="text-muted-foreground mt-1">
          View your subscription billing information
        </p>
      </div>

      {/* Current Subscription Billing */}
      {subscription && (
        <div className="bg-card rounded-xl border border-border/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Current Billing
              </h2>
              <p className="text-sm text-muted-foreground">
                {subscription.planDetails?.name} subscription
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Plan</p>
              <p className="text-lg font-semibold text-foreground">
                {subscription.planDetails?.name || subscription.tier}
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-xl font-bold text-foreground">
                {subscription.planDetails?.price || "₦140,000"}
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Next Billing Date</p>
              <p className="text-lg font-semibold text-foreground">
                {subscription.nextBillingDate ? 
                  new Date(subscription.nextBillingDate).toLocaleDateString() : 
                  "N/A"
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No Active Subscription Message */}
      {!subscription && (
        <div className="bg-card rounded-xl border border-border/50 p-6 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Active Subscription
          </h3>
          <p className="text-muted-foreground mb-4">
            You don't have an active subscription yet. Create one to start enjoying fresh deliveries.
          </p>
          <Button onClick={() => navigate('/dashboard/subscription')}>
            View Subscriptions
          </Button>
        </div>
      )}
    </div>
  );
};

export default DashboardPayment;