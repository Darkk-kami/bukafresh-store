package com.dark_store.bukafresh_backend.dto.response;

import com.dark_store.bukafresh_backend.model.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private String userId;
    private String email;
    private String token;

    public static LoginResponse fromEntity(User user, String token) {
        return LoginResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .token(token)
                .build();
    }
}
