package com.dark_store.bukafresh_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class BankAccount {

    @NotBlank
    @Pattern(
            regexp = "^\\d{10}$",
            message = "Account number must be 10 digits"
    )
    private String accountNumber;

    @NotBlank
    @Pattern(
            regexp = "^\\d{3}$",
            message = "Bank code must be 3 digits"
    )
    private String bankCode;
}

