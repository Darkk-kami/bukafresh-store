package com.dark_store.bukafresh_backend.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreatePaymentMandateRequest {

    @NotBlank(message = "Plan code is required")
    private String planCode;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50)
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^234\\d{10}$",
            message = "Phone must be in format 234XXXXXXXXXX"
    )
    private String phone;

    @Valid
    @NotNull(message = "Address is required")
    private Address address;

    @Valid
    @NotNull(message = "Bank account is required")
    private BankAccount bankAccount;

    @NotBlank(message = "BVN is required")
    @Pattern(
            regexp = "^\\d{11}$",
            message = "BVN must be exactly 11 digits"
    )
    private String bvn;
}