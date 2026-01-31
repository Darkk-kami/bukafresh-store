package com.dark_store.bukafresh_backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateSubscriptionRequest {

    @NotBlank(message = "Tier is required")
    @Pattern(
            regexp = "^(ESSENTIALS|STANDARD|PREMIUM)$",
            message = "Tier must be one of: ESSENTIALS, STANDARD, PREMIUM"
    )
    private String tier;

    @NotBlank(message = "Billing cycle is required")
    @Pattern(
            regexp = "^(MONTHLY|YEARLY)$",
            message = "Billing cycle must be MONTHLY or YEARLY"
    )
    private String billingCycle;

    // Optional: for future payment integration
    private String paymentMethodId;

    private BigDecimal price;
    
    // Optional: for delivery preferences
    private String deliveryDay;
}
