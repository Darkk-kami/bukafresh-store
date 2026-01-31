package com.dark_store.bukafresh_backend.controller;

import com.dark_store.bukafresh_backend.dto.request.CreateSubscriptionRequest;
import com.dark_store.bukafresh_backend.dto.response.ApiResponse;
import com.dark_store.bukafresh_backend.dto.response.SubscriptionResponse;
import com.dark_store.bukafresh_backend.service.SubscriptionService;
import com.dark_store.bukafresh_backend.util.CurrentUserUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/subscriptions")
@Slf4j
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    // Simple test endpoint
    @GetMapping("/test")
    public ResponseEntity<ApiResponse<String>> test() {
        return ResponseEntity.ok(ApiResponse.success(
                "Subscription controller is working",
                "Hello from subscription controller!"
        ));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('USER_PROFILE_UPDATE')")
    public ResponseEntity<ApiResponse<SubscriptionResponse>> createSubscription(
            @Valid @RequestBody CreateSubscriptionRequest request) {
        
        log.info("Creating subscription for tier: {}", request.getTier());
        
        SubscriptionResponse response = subscriptionService.createSubscription(request);
        
        return ResponseEntity.ok(ApiResponse.success(
                "Subscription created successfully",
                response
        ));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('USER_PROFILE_READ')")
    public ResponseEntity<ApiResponse<SubscriptionResponse>> getCurrentUserSubscription() {
        String userId = CurrentUserUtil.getCurrentUserId();
        
        log.info("Fetching subscription for user: {}", userId);
        
        SubscriptionResponse response = subscriptionService.getUserSubscription(userId);
        
        return ResponseEntity.ok(ApiResponse.success(
                "Subscription retrieved successfully",
                response
        ));
    }

    @GetMapping("/me/all")
    @PreAuthorize("hasAuthority('USER_PROFILE_READ')")
    public ResponseEntity<ApiResponse<List<SubscriptionResponse>>> getAllUserSubscriptions() {
        String userId = CurrentUserUtil.getCurrentUserId();
        
        log.info("Fetching all subscriptions for user: {}", userId);
        
        List<SubscriptionResponse> responses = subscriptionService.getAllUserSubscriptions(userId);
        
        return ResponseEntity.ok(ApiResponse.success(
                "Subscriptions retrieved successfully",
                responses
        ));
    }

    @PutMapping("/{subscriptionId}/pause")
    @PreAuthorize("hasAuthority('USER_PROFILE_UPDATE')")
    public ResponseEntity<ApiResponse<SubscriptionResponse>> pauseSubscription(
            @PathVariable String subscriptionId) {
        
        log.info("Pausing subscription: {}", subscriptionId);
        
        SubscriptionResponse response = subscriptionService.pauseSubscription(subscriptionId);
        
        return ResponseEntity.ok(ApiResponse.success(
                "Subscription paused successfully",
                response
        ));
    }

    @PutMapping("/{subscriptionId}/resume")
    @PreAuthorize("hasAuthority('USER_PROFILE_UPDATE')")
    public ResponseEntity<ApiResponse<SubscriptionResponse>> resumeSubscription(
            @PathVariable String subscriptionId) {
        
        log.info("Resuming subscription: {}", subscriptionId);
        
        SubscriptionResponse response = subscriptionService.resumeSubscription(subscriptionId);
        
        return ResponseEntity.ok(ApiResponse.success(
                "Subscription resumed successfully",
                response
        ));
    }

    @PutMapping("/{subscriptionId}/cancel")
    @PreAuthorize("hasAuthority('USER_PROFILE_UPDATE')")
    public ResponseEntity<ApiResponse<SubscriptionResponse>> cancelSubscription(
            @PathVariable String subscriptionId) {
        
        log.info("Cancelling subscription: {}", subscriptionId);
        
        SubscriptionResponse response = subscriptionService.cancelSubscription(subscriptionId);
        
        return ResponseEntity.ok(ApiResponse.success(
                "Subscription cancelled successfully",
                response
        ));
    }

    @PutMapping("/{subscriptionId}/activate")
    @PreAuthorize("hasAuthority('USER_PROFILE_UPDATE')")
    public ResponseEntity<ApiResponse<SubscriptionResponse>> activateSubscription(
            @PathVariable String subscriptionId) {
        
        log.info("Activating subscription: {}", subscriptionId);
        
        SubscriptionResponse response = subscriptionService.activateSubscription(subscriptionId);
        
        return ResponseEntity.ok(ApiResponse.success(
                "Subscription activated successfully",
                response
        ));
    }

    @PutMapping("/{subscriptionId}/status")
    @PreAuthorize("hasAuthority('USER_PROFILE_UPDATE')")
    public ResponseEntity<ApiResponse<SubscriptionResponse>> updateSubscriptionStatus(
            @PathVariable String subscriptionId,
            @RequestParam String status) {
        
        log.info("Updating subscription {} status to: {}", subscriptionId, status);
        
        SubscriptionResponse response = subscriptionService.updateSubscriptionStatus(subscriptionId, status);
        
        return ResponseEntity.ok(ApiResponse.success(
                "Subscription status updated successfully",
                response
        ));
    }

    @DeleteMapping("/{subscriptionId}")
    @PreAuthorize("hasAuthority('USER_PROFILE_UPDATE')")
    public ResponseEntity<ApiResponse<String>> deleteSubscription(
            @PathVariable String subscriptionId) {
        
        log.info("Deleting subscription: {}", subscriptionId);
        
        subscriptionService.deleteSubscription(subscriptionId);
        
        return ResponseEntity.ok(ApiResponse.success(
                "Subscription deleted successfully",
                "Subscription has been permanently deleted"
        ));
    }
}