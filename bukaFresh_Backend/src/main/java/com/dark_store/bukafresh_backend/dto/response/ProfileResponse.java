package com.dark_store.bukafresh_backend.dto.response;

import com.dark_store.bukafresh_backend.model.Address;
import com.dark_store.bukafresh_backend.model.Profile;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ProfileResponse {
    private String id;
    private String userId;
    private String firstName;
    private String lastName;
    private String fullName;
    private String phone;
    private String avatarId;
    private String subscriptionId;
    private String packagePlan;
    private List<Address> addresses;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ProfileResponse fromEntity(Profile profile) {
        return ProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .fullName(profile.getFullName())
                .phone(profile.getPhone())
                .avatarId(profile.getAvatarId())
                .subscriptionId(profile.getSubscriptionId())
                .packagePlan(profile.getPackagePlan())
                .addresses(profile.getAddresses())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}