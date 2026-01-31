package com.dark_store.bukafresh_backend.service;

import com.dark_store.bukafresh_backend.dto.request.CheckoutRegisterRequest;
import com.dark_store.bukafresh_backend.dto.request.CreateUserRequest;
import com.dark_store.bukafresh_backend.dto.request.LoginRequest;
import com.dark_store.bukafresh_backend.dto.response.CheckoutRegisterResponse;
import com.dark_store.bukafresh_backend.dto.response.LoginResponse;
import com.dark_store.bukafresh_backend.dto.response.ProfileResponse;

public interface UserService {
    void createAccount(CreateUserRequest request);

    LoginResponse verifyEmail(String userId, String token);

    LoginResponse login(LoginRequest request);

    void checkoutRegister(CheckoutRegisterRequest request);
 
    void resendVerificationEmail(String email);

    ProfileResponse getCurrentUserProfile(String userId);
}
