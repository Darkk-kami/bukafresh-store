package com.dark_store.bukafresh_backend.model;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private String subscriptionId;
    private LocalDate deliveryDate;
    private List<OrderItem> products;
    private String status; // PENDING, SCHEDULED, DELIVERED, CANCELED
    private String paymentStatus; // PAID, UNPAID
    private LocalDateTime createdAt;
    private LocalDate updatedAt;

    @Data
    public static class OrderItem {
        private String productId;
        private String name;
        private int quantity;
    }

}
