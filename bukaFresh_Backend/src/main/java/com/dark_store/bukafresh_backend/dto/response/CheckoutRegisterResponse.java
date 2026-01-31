package com.dark_store.bukafresh_backend.dto.response;

import com.dark_store.bukafresh_backend.model.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CheckoutRegisterResponse {
    private String userId;
    private String email;
    private String token;
    private Boolean accountCreated;
    private String message;

    public static CheckoutRegisterResponse fromEntity(User user, String token) {
        return CheckoutRegisterResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .token(token)
                .accountCreated(true)
                .message("Account created successfully. Please verify your email.")
                .build();
    }
}
