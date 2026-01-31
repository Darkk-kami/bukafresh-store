package com.dark_store.bukafresh_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private String id;
    private String userId;
    private String subscriptionId;
    private BigDecimal amount;
    private String currency;
    private String status;
    private String paymentReference;
    private String bankName;
    private String accountNumber; // Masked for security
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
    private String failureReason;
}