package com.dark_store.bukafresh_backend.service.impl;

import com.dark_store.bukafresh_backend.dto.request.CreateSubscriptionRequest;
import com.dark_store.bukafresh_backend.dto.response.SubscriptionResponse;
import com.dark_store.bukafresh_backend.exception.BusinessException;
import com.dark_store.bukafresh_backend.exception.ResourceNotFoundException;
import com.dark_store.bukafresh_backend.model.Subscription;
import com.dark_store.bukafresh_backend.repository.SubscriptionRepository;
import com.dark_store.bukafresh_backend.service.SubscriptionService;
import com.dark_store.bukafresh_backend.service.clients.OnePipeMandateClient;
import com.dark_store.bukafresh_backend.util.CurrentUserUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final OnePipeMandateClient onePipeMandateClient;

    @Override
    public SubscriptionResponse createSubscription(CreateSubscriptionRequest request) {
        String userId = CurrentUserUtil.getCurrentUserId();
        
        // Check if user already has any subscription (active, pending, or inactive)
        List<Subscription> existingSubscriptions = subscriptionRepository.findByUserId(userId);
        boolean hasAnySubscription = existingSubscriptions.stream()
                .anyMatch(sub -> "ACTIVE".equals(sub.getStatus()) || 
                               "PENDING".equals(sub.getStatus()) || 
                               "INACTIVE".equals(sub.getStatus()));
        
        if (hasAnySubscription) {
            throw new BusinessException("User already has a subscription. Please complete payment for your existing subscription or delete it before creating a new one.");
        }

        try {
            // Create subscription with PENDING status (requires payment to activate)
            Subscription subscription = new Subscription();
            subscription.setUserId(userId);
            subscription.setTier(request.getTier());
            subscription.setStatus("PENDING"); // Changed from ACTIVE to PENDING
            subscription.setPrice(request.getPrice());
            subscription.setBillingCycle(request.getBillingCycle());
            subscription.setNextBillingDate(calculateNextBillingDate(request.getBillingCycle()));
            subscription.setCreatedAt(LocalDateTime.now());
            subscription.setUpdatedAt(LocalDateTime.now());

            Subscription savedSubscription = subscriptionRepository.save(subscription);
            
            log.info("Created PENDING subscription {} for user {} with tier {} - requires payment to activate", 
                    savedSubscription.getId(), userId, request.getTier());
            
            return mapToResponse(savedSubscription);
            
        } catch (Exception e) {
            log.error("Failed to create subscription for user {}: {}", userId, e.getMessage());
            throw new BusinessException("Failed to create subscription: " + e.getMessage());
        }
    }

    private LocalDate calculateNextBillingDate(String billingCycle) {
        LocalDate now = LocalDate.now();
        return switch (billingCycle) {
            case "MONTHLY" -> now.plusMonths(1);
            case "YEARLY" -> now.plusYears(1);
            default -> now.plusMonths(1);
        };
    }

    @Override
    public SubscriptionResponse getUserSubscription(String userId) {
        List<Subscription> subscriptions = subscriptionRepository.findByUserId(userId);
        System.out.println("Subscription" + subscriptions);

        System.out.println("user id for sub" + userId);
        Subscription activeSubscription = subscriptions.stream()
                .filter(sub -> "ACTIVE".equals(sub.getStatus().toUpperCase()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("No active subscription found for user"));
        
        return mapToResponse(activeSubscription);
    }

    @Override
    public SubscriptionResponse updateSubscriptionStatus(String subscriptionId, String status) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found"));
        
        subscription.setStatus(status);
        subscription.setUpdatedAt(LocalDateTime.now());
        
        Subscription updatedSubscription = subscriptionRepository.save(subscription);
        
        log.info("Updated subscription {} status to {}", subscriptionId, status);
        
        return mapToResponse(updatedSubscription);
    }

    @Override
    public SubscriptionResponse pauseSubscription(String subscriptionId) {
        return updateSubscriptionStatus(subscriptionId, "PAUSED");
    }

    @Override
    public SubscriptionResponse resumeSubscription(String subscriptionId) {
        return updateSubscriptionStatus(subscriptionId, "ACTIVE");
    }

    @Override
    public SubscriptionResponse cancelSubscription(String subscriptionId) {
        return updateSubscriptionStatus(subscriptionId, "CANCELED");
    }

    @Override
    public SubscriptionResponse activateSubscription(String subscriptionId) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found"));
        
        if (!"PENDING".equals(subscription.getStatus())) {
            throw new BusinessException("Only pending subscriptions can be activated");
        }
        
        subscription.setStatus("ACTIVE");
        subscription.setUpdatedAt(LocalDateTime.now());
        
        Subscription activatedSubscription = subscriptionRepository.save(subscription);
        
        log.info("Activated subscription {} for user {}", subscriptionId, subscription.getUserId());
        
        return mapToResponse(activatedSubscription);
    }

    @Override
    public List<SubscriptionResponse> getAllUserSubscriptions(String userId) {
        List<Subscription> subscriptions = subscriptionRepository.findByUserId(userId);
        
        return subscriptions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void processDueSubscriptions() {
        LocalDate today = LocalDate.now();
        List<Subscription> dueSubscriptions = subscriptionRepository.findByNextBillingDate(today);

        for (Subscription sub : dueSubscriptions) {
            try {
                // TODO: Call OnePipe collect API to charge customer
                // TODO: Create order in Order collection
                // TODO: Update nextBillingDate
                log.info("Processing subscription for user: {}", sub.getUserId());
                
                // Update next billing date
                sub.setNextBillingDate(today.plusMonths(1));
                sub.setUpdatedAt(LocalDateTime.now());
                subscriptionRepository.save(sub);
                
            } catch (Exception e) {
                log.error("Failed to process subscription {} for user {}: {}", 
                         sub.getId(), sub.getUserId(), e.getMessage());
            }
        }
    }

    private SubscriptionResponse mapToResponse(Subscription subscription) {
        return SubscriptionResponse.builder()
                .id(subscription.getId())
                .userId(subscription.getUserId())
                .tier(subscription.getTier())
                .status(subscription.getStatus())
                .billingCycle(subscription.getBillingCycle())
                .nextBillingDate(subscription.getNextBillingDate())
                .mandateId(subscription.getMandateId())
                .createdAt(subscription.getCreatedAt())
                .updatedAt(subscription.getUpdatedAt())
                .planDetails(getPlanDetails(subscription.getTier()))
                .build();
    }

    private SubscriptionResponse.PlanDetails getPlanDetails(String tier) {
        if (tier == null || tier.isBlank()) {
            throw new IllegalArgumentException("Subscription tier must be provided");
        }

        return switch (tier.toUpperCase()) {
            case "ESSENTIALS" -> SubscriptionResponse.PlanDetails.builder()
                    .name("Essentials Package")
                    .description("Basic fresh groceries for small households")
                    .price("₦80,000")
                    .deliveryFrequency("Monthly")
                    .deliveryDay("Saturday")
                    .build();

            case "STANDARD" -> SubscriptionResponse.PlanDetails.builder()
                    .name("Standard Package")
                    .description("Complete fresh groceries for medium households")
                    .price("₦140,000")
                    .deliveryFrequency("Monthly")
                    .deliveryDay("Saturday")
                    .build();

            case "PREMIUM" -> SubscriptionResponse.PlanDetails.builder()
                    .name("Premium Package")
                    .description("Premium fresh groceries for large households")
                    .price("₦200,000")
                    .deliveryFrequency("Monthly")
                    .deliveryDay("Saturday")
                    .build();

            default -> throw new IllegalArgumentException(
                    "Invalid subscription tier: " + tier
            );
        };
    }

    @Override
    public void deleteSubscription(String subscriptionId) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + subscriptionId));
        
        String currentUserId = CurrentUserUtil.getCurrentUserId();
        
        // Verify that the subscription belongs to the current user
        if (!subscription.getUserId().equals(currentUserId)) {
            throw new BusinessException("You can only delete your own subscriptions");
        }
        
        // Only allow deletion of PENDING or INACTIVE subscriptions
        if ("ACTIVE".equals(subscription.getStatus())) {
            throw new BusinessException("Cannot delete an active subscription. Please cancel it first.");
        }
        
        log.info("Deleting subscription {} for user {}", subscriptionId, currentUserId);
        subscriptionRepository.delete(subscription);
    }
}
