package com.dark_store.bukafresh_backend.service;

import com.dark_store.bukafresh_backend.dto.request.CreateSubscriptionRequest;
import com.dark_store.bukafresh_backend.dto.response.SubscriptionResponse;
import com.dark_store.bukafresh_backend.model.Subscription;

import java.util.List;

public interface SubscriptionService {
    SubscriptionResponse createSubscription(CreateSubscriptionRequest request);
    SubscriptionResponse getUserSubscription(String userId);
    SubscriptionResponse updateSubscriptionStatus(String subscriptionId, String status);
    SubscriptionResponse pauseSubscription(String subscriptionId);
    SubscriptionResponse resumeSubscription(String subscriptionId);
    SubscriptionResponse cancelSubscription(String subscriptionId);
    SubscriptionResponse activateSubscription(String subscriptionId);
    List<SubscriptionResponse> getAllUserSubscriptions(String userId);
    void processDueSubscriptions();
    void deleteSubscription(String subscriptionId);
}
