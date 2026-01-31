package com.dark_store.bukafresh_backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "payments")
public class Payment {
    @Id
    private String id;
    
    private String userId;
    private String subscriptionId;
    private BigDecimal amount;
    private String currency;
    
    // Payment method details
    private String bvn;
    private String accountNumber;
    private String bankName;
    private String phoneNumber;
    private String firstName;
    private String lastName;
    
    // Payment status and tracking
    private String status; // PENDING, PROCESSING, PAID, FAILED
    private String paymentReference;
    private String onePipeReference;
    private String failureReason;
    
    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime paidAt;
    
    // OnePipe response data
    private String onePipeResponse;
}