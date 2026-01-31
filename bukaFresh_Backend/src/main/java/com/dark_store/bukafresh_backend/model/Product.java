package com.dark_store.bukafresh_backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "products")
public class Product {
    @Id
    private String id;
    private String name;
    private String category; // STAPLE, VEGETABLE, FRUIT, PROTEIN, DAIRY, BEVERAGE
    private boolean perishable;
    private double price;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
