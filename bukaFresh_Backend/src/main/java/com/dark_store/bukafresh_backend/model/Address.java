package com.dark_store.bukafresh_backend.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Address {
    private String id;
    private String street;
    private String userId;
    private String city;
    private String state;
    private String type;
    private String postalCode;
    private String instructions;
    private Boolean isDefault;
}
