// Simple test file to verify subscription API endpoints
// This can be run in the browser console or used for testing

import { subscriptionService } from "./subscriptionService";

export const testSubscriptionAPI = async () => {
  console.log("Testing Subscription API...");

  try {
    // Test 1: Get current subscription (should return 404 if no subscription exists)
    console.log("1. Testing getCurrentSubscription...");
    try {
      const currentSub = await subscriptionService.getCurrentSubscription();
      console.log("✅ Current subscription:", currentSub);
    } catch (error) {
      if (error.message.includes("not found")) {
        console.log("ℹ️ No active subscription found (expected for new users)");
      } else {
        console.error("❌ Error getting current subscription:", error.message);
      }
    }

    // Test 2: Get all subscriptions
    console.log("2. Testing getAllUserSubscriptions...");
    try {
      const allSubs = await subscriptionService.getAllUserSubscriptions();
      console.log("✅ All subscriptions:", allSubs);
    } catch (error) {
      console.error("❌ Error getting all subscriptions:", error.message);
    }

    // Test 3: Create a test subscription (commented out to avoid creating real subscriptions)
    /*
    console.log("3. Testing createSubscription...");
    const testSubscriptionData = {
      planCode: "STANDARD",
      amount: 140000,
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      phone: "2348012345678",
      address: {
        street: "123 Test Street",
        city: "Lagos",
        state: "Lagos",
        country: "Nigeria"
      },
      bankAccount: {
        accountNumber: "1234567890",
        bankCode: "058"
      },
      bvn: "12345678901"
    };

    try {
      const newSub = await subscriptionService.createSubscription(testSubscriptionData);
      console.log("✅ Created subscription:", newSub);
    } catch (error) {
      console.error("❌ Error creating subscription:", error.message);
    }
    */

    console.log("Subscription API test completed!");

  } catch (error) {
    console.error("❌ General error during API test:", error);
  }
};

// Export for use in browser console
window.testSubscriptionAPI = testSubscriptionAPI;