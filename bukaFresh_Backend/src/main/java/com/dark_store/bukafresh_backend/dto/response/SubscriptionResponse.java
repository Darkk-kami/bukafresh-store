package com.dark_store.bukafresh_backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class SubscriptionResponse {
    private String id;
    private String userId;
    private String tier;
    private String status;
    private String billingCycle;
    private LocalDate nextBillingDate;
    private String mandateId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private PlanDetails planDetails;

    @Data
    @Builder
    public static class PlanDetails {
        private String name;
        private String description;
        private String price;
        private String deliveryFrequency;
        private String deliveryDay;
    }
}