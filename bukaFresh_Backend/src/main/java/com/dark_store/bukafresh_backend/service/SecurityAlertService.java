package com.dark_store.bukafresh_backend.service;


import com.dark_store.bukafresh_backend.model.User;
import org.springframework.scheduling.annotation.Async;

public interface SecurityAlertService {
    void sendNewDeviceLoginAlert(String email, String ip, String userAgent);


    @Async
    void SendEmailVerificationToNewUser(User savedUser, String token);
}
