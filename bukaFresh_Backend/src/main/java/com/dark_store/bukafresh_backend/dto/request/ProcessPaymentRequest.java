package com.dark_store.bukafresh_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcessPaymentRequest {
    
    @NotBlank(message = "Subscription ID is required")
    private String subscriptionId;

    @NotBlank(message = "BVN is required")
    @Size(min = 11, max = 11, message = "BVN must be exactly 11 digits")
    @Pattern(regexp = "\\d{11}", message = "BVN must contain only digits")
    private String bvn;
    
    @NotBlank(message = "Account number is required")
    @Size(min = 10, max = 10, message = "Account number must be exactly 10 digits")
    @Pattern(regexp = "\\d{10}", message = "Account number must contain only digits")
    private String accountNumber;
    
    @NotBlank(message = "Bank name is required")
    private String bankName;
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^(\\+234[789]\\d{9}|0[789]\\d{9})$", message = "Invalid Nigerian phone number format. Use +234XXXXXXXXXX or 0XXXXXXXXX")
    private String phoneNumber;
    
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
}