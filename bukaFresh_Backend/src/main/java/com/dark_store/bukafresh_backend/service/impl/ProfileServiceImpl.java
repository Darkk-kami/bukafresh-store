package com.dark_store.bukafresh_backend.service.impl;

import com.dark_store.bukafresh_backend.model.Address;
import com.dark_store.bukafresh_backend.model.Profile;
import com.dark_store.bukafresh_backend.repository.ProfileRepository;
import com.dark_store.bukafresh_backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;

    @Override
    public void createProfile(String firstName, String lastName, Address address, String userId) {

        Profile userProfile = Profile.builder()
                .firstName(firstName)
                .lastName(lastName)
                .addresses(List.of(address))
                .userId(userId)
                .build();

        profileRepository.save(userProfile);
    }

    @Override
    public void createProfile(String firstName, String lastName, String phone, String userId) {

        Profile userProfile = Profile.builder()
                .firstName(firstName)
                .lastName(lastName)
                .userId(userId)
                .phone(phone)
                .build();

        profileRepository.save(userProfile);
    }

    @Override
    public Profile updateProfile(String profileId, Profile profile) {
        Profile existingProfile = profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        if (profile.getFirstName() != null) existingProfile.setFirstName(profile.getFirstName());
        if (profile.getLastName() != null) existingProfile.setLastName(profile.getLastName());
        if (profile.getPhone() != null) existingProfile.setPhone(profile.getPhone());
        if (profile.getAvatarId() != null) existingProfile.setAvatarId(profile.getAvatarId());
        if (profile.getAddresses() != null) existingProfile.setAddresses(profile.getAddresses());
        if (profile.getSubscriptionId() != null) existingProfile.setSubscriptionId(profile.getSubscriptionId());

        existingProfile.setUpdatedAt(LocalDateTime.now());

        return profileRepository.save(existingProfile);
    }

    @Override
    public Profile getProfileById(String profileId) {
        return profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    @Override
    public Profile getProfileByUserId(String userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found for user"));
    }

    @Override
    public Address addAddressToProfile(String userId, Address address) {
        Profile profile = getProfileByUserId(userId);
        
        // Set address ID if not provided
        if (address.getId() == null) {
            address.setId(java.util.UUID.randomUUID().toString());
        }
        
        // If this is the first address, make it default
        if (profile.getAddresses() == null || profile.getAddresses().isEmpty()) {
            address.setIsDefault(true);
            profile.setAddresses(List.of(address));
        } else {
            // Add to existing addresses
            List<Address> addresses = new java.util.ArrayList<>(profile.getAddresses());
            addresses.add(address);
            profile.setAddresses(addresses);
        }
        
        profile.setUpdatedAt(LocalDateTime.now());
        profileRepository.save(profile);
        
        return address;
    }

    @Override
    public List<Address> getUserAddresses(String userId) {
        Profile profile = getProfileByUserId(userId);
        return profile.getAddresses() != null ? profile.getAddresses() : List.of();
    }

    @Override
    public Address updateAddress(String userId, String addressId, Address updatedAddress) {
        Profile profile = getProfileByUserId(userId);
        
        if (profile.getAddresses() == null) {
            throw new RuntimeException("No addresses found for user");
        }
        
        List<Address> addresses = new java.util.ArrayList<>(profile.getAddresses());
        boolean found = false;
        
        for (int i = 0; i < addresses.size(); i++) {
            if (addresses.get(i).getId().equals(addressId)) {
                updatedAddress.setId(addressId);
                addresses.set(i, updatedAddress);
                found = true;
                break;
            }
        }
        
        if (!found) {
            throw new RuntimeException("Address not found");
        }
        
        profile.setAddresses(addresses);
        profile.setUpdatedAt(LocalDateTime.now());
        profileRepository.save(profile);
        
        return updatedAddress;
    }

    @Override
    public void deleteAddress(String userId, String addressId) {
        Profile profile = getProfileByUserId(userId);
        
        if (profile.getAddresses() == null) {
            throw new RuntimeException("No addresses found for user");
        }
        
        List<Address> addresses = new java.util.ArrayList<>(profile.getAddresses());
        boolean removed = addresses.removeIf(address -> address.getId().equals(addressId));
        
        if (!removed) {
            throw new RuntimeException("Address not found");
        }
        
        profile.setAddresses(addresses);
        profile.setUpdatedAt(LocalDateTime.now());
        profileRepository.save(profile);
    }

    @Override
    public Address setDefaultAddress(String userId, String addressId) {
        Profile profile = getProfileByUserId(userId);
        
        if (profile.getAddresses() == null) {
            throw new RuntimeException("No addresses found for user");
        }
        
        List<Address> addresses = new java.util.ArrayList<>(profile.getAddresses());
        Address defaultAddress = null;
        
        // Set all addresses to non-default and find the target address
        for (Address address : addresses) {
            if (address.getId().equals(addressId)) {
                address.setIsDefault(true);
                defaultAddress = address;
            } else {
                address.setIsDefault(false);
            }
        }
        
        if (defaultAddress == null) {
            throw new RuntimeException("Address not found");
        }
        
        profile.setAddresses(addresses);
        profile.setUpdatedAt(LocalDateTime.now());
        profileRepository.save(profile);
        
        return defaultAddress;
    }

}
