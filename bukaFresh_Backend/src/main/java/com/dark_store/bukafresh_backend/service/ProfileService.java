package com.dark_store.bukafresh_backend.service;

import com.dark_store.bukafresh_backend.model.Address;
import com.dark_store.bukafresh_backend.model.Profile;

import java.util.List;

public interface ProfileService {

    void createProfile(String firstName, String lastName, Address address, String userId);

    void createProfile(String firstName, String lastName, String phone, String userId);

    Profile updateProfile(String profileId, Profile profile);

    Profile getProfileById(String profileId);

    Profile getProfileByUserId(String userId);

    // Address management methods
    Address addAddressToProfile(String userId, Address address);

    List<Address> getUserAddresses(String userId);

    Address updateAddress(String userId, String addressId, Address address);

    void deleteAddress(String userId, String addressId);

    Address setDefaultAddress(String userId, String addressId);
}
