import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
} from 'lucide-react';
import { SubscriptionCreationProvider, useSubscriptionCreationContext } from '../context/SubscriptionCreationContext';
import { SubscriptionPackageSelection } from './SubscriptionPackageSelection';
import { SubscriptionDeliverySetup } from './SubscriptionDeliverySetup';
import { showSuccessAlert, showErrorAlert } from '@/shared/customAlert';

function NoActiveSubscriptionContent({ createSubscription, isCreating }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('package');
  const { selectedPackage, deliveryFrequency, deliveryAddress } = useSubscriptionCreationContext();

  const handleContinueToAddress = () => {
    setCurrentStep('address');
  };

  const handleBack = () => {
    setCurrentStep('package');
  };

  const handleCreateSubscription = async () => {
    if (!selectedPackage || !deliveryAddress) {
      showErrorAlert('Missing Information', 'Please select a package and delivery address.');
      return;
    }

    try {
      // Map package ID to tier
      const tierMap = {
        'pkg-essentials': 'ESSENTIALS',
        'pkg-standard': 'STANDARD', 
        'pkg-premium': 'PREMIUM'
      };

      const subscriptionRequest = {
        tier: tierMap[selectedPackage.id] || 'STANDARD',
        billingCycle: deliveryFrequency === 'weekly' ? 'WEEKLY' : 'MONTHLY',
        deliveryDay: 'SATURDAY'
      };

      const response = await createSubscription(subscriptionRequest);
      
      showSuccessAlert('Subscription Created!', 'Your subscription has been created. Complete payment to activate it.');
      
      // Navigate to payment page with subscription data
      // Backend returns ApiResponse<SubscriptionResponse>, so data is nested under response.data
      const subscriptionId = response?.data?.id;
      const responseData = response?.data;
      
      if (subscriptionId) {
        navigate('/dashboard/payment', {
          state: {
            subscriptionId,
            subscriptionData: responseData,
            fromSubscriptionCreation: true
          }
        });
      } else {
        console.error('No subscription ID found in response:', response);
        showErrorAlert('Navigation Error', 'Subscription created but unable to navigate to payment. Please go to payment manually.');
      }
      
    } catch (error) {
      console.error('Subscription creation error:', error);
      showErrorAlert('Creation Failed', 'Failed to create subscription. Please try again.');
    }
  };

  if (currentStep === 'package') {
    return (
      <div className="space-y-8">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            No Active Subscription
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Start your fresh food journey today! Choose a plan that fits your
            household and enjoy convenient deliveries.
          </p>
        </div>

        <SubscriptionPackageSelection onContinue={handleContinueToAddress} />
      </div>
    );
  }

  return (
    <SubscriptionDeliverySetup 
      onBack={handleBack}
      onContinue={handleCreateSubscription}
      isCreating={isCreating}
    />
  );
}

export function NoActiveSubscription({ createSubscription, isCreating }) {
  return (
    <SubscriptionCreationProvider>
      <NoActiveSubscriptionContent 
        createSubscription={createSubscription}
        isCreating={isCreating}
      />
    </SubscriptionCreationProvider>
  );
}
