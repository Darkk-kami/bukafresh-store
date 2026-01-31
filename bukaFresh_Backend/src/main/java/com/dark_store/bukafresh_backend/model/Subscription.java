package com.dark_store.bukafresh_backend.model;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Document(collection = "subscriptions")
public class Subscription {
    @Id
    private String id;
    private String userId;
    private String tier;
    private String status;
    private BigDecimal price;
    private String billingCycle;
    private LocalDate nextBillingDate;
    private String mandateId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}