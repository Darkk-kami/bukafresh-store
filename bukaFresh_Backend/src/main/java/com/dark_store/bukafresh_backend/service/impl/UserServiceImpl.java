package com.dark_store.bukafresh_backend.service.impl;

import com.dark_store.bukafresh_backend.config.JwtUtil;
import com.dark_store.bukafresh_backend.dto.request.CheckoutRegisterRequest;
import com.dark_store.bukafresh_backend.dto.request.CreateUserRequest;
import com.dark_store.bukafresh_backend.dto.request.LoginRequest;
import com.dark_store.bukafresh_backend.dto.response.CheckoutRegisterResponse;
import com.dark_store.bukafresh_backend.dto.response.LoginResponse;
import com.dark_store.bukafresh_backend.dto.response.ProfileResponse;
import com.dark_store.bukafresh_backend.exception.*;
import com.dark_store.bukafresh_backend.model.Address;
import com.dark_store.bukafresh_backend.model.Profile;
import com.dark_store.bukafresh_backend.model.Role;
import com.dark_store.bukafresh_backend.model.User;
import com.dark_store.bukafresh_backend.repository.AddressRepository;
import com.dark_store.bukafresh_backend.repository.UserRepository;
import com.dark_store.bukafresh_backend.service.ProfileService;
import com.dark_store.bukafresh_backend.service.SecurityAlertService;
import com.dark_store.bukafresh_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecurityAlertService securityAlertService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final AddressRepository addressRepository;
    private final ProfileService profileService;

    @Override
    public void createAccount(CreateUserRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new UserAlreadyExistsException(
                    "User with email '" + request.email() + "' already exists."
            );
        }

        String plainToken = UUID.randomUUID().toString();

        User savedUser = userRepository.save(
                User.builder()
                        .email(request.email())
                        .password(passwordEncoder.encode(request.password()))
                        .emailVerified(false)
                        .emailVerificationToken(passwordEncoder.encode(plainToken))
                        .emailVerificationTokenExpiry(LocalDateTime.now().plusMinutes(30))
                        .role(Role.USER)
                        .build()
        );

        profileService.createProfile(
                request.firstName(), 
                request.lastName(), 
                request.phone(),
                savedUser.getId()
        );

        securityAlertService.SendEmailVerificationToNewUser(savedUser, plainToken);
    }

    @Override
    public LoginResponse verifyEmail(String userId,String token) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new TokenNotFoundException("Invalid user"));

        if (Boolean.TRUE.equals(user.getEmailVerified())) {

            throw new UserAlreadyVerifiedException("User Already Verified");
        }

        if (!passwordEncoder.matches(token, user.getEmailVerificationToken())) {
            throw new TokenNotFoundException("Invalid token");
        }

        if (user.getEmailVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new TokenExpiredException("Expired token");
        }


        user.setEmailVerified(true);
        user.setEmailVerificationToken(null);
        user.setEmailVerificationTokenExpiry(null);

        User savedUser = userRepository.save(user);

        String jwtToken = jwtUtil.generateToken(savedUser);

        return LoginResponse.fromEntity(savedUser, jwtToken);
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid credentials"));

        if (!Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new UnVerifiedEmailException("Kindly verify your email before logging in");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        String jwtToken = jwtUtil.generateToken(user);

        return LoginResponse.fromEntity(user,jwtToken);

    }

    @Override
    public void checkoutRegister(CheckoutRegisterRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new UserAlreadyExistsException("Email already registered");
        }

        String plainToken = UUID.randomUUID().toString();

        User savedUser = userRepository.save(
                User.builder()
                        .email(request.email())
                        .password(passwordEncoder.encode(request.password()))
                        .emailVerified(false) // 👈 critical
                        .emailVerificationToken(passwordEncoder.encode(plainToken))
                        .emailVerificationTokenExpiry(LocalDateTime.now().plusMinutes(30))
                        .role(Role.USER)
                        .build()
        );

        Address address = Address.builder()
                .id(UUID.randomUUID().toString())
                .street(request.deliveryAddress().street())
                .city(request.deliveryAddress().city())
                .state(request.deliveryAddress().state())
                .postalCode(request.deliveryAddress().postalCode())
                .instructions(request.deliveryAddress().instructions())
                .userId(savedUser.getId())
                .type("checkout")
                .isDefault(true)
                .build();

        addressRepository.save(address);

        profileService.createProfile(
                request.firstName(),
                request.lastName(),
                address,
                savedUser.getId()
        );

        securityAlertService.SendEmailVerificationToNewUser(savedUser, plainToken);

//        return CheckoutRegisterResponse.pendingVerification(savedUser);
    }

    @Override
    public void resendVerificationEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getEmailVerified()) {
            throw new BusinessException("Email is already verified");
        }

        String newToken = UUID.randomUUID().toString();

        user.setEmailVerificationToken(passwordEncoder.encode(newToken));
        user.setEmailVerificationTokenExpiry(LocalDateTime.now().plusMinutes(30));

        userRepository.save(user);

        securityAlertService.SendEmailVerificationToNewUser(user, newToken);
    }

    @Override
    public ProfileResponse getCurrentUserProfile(String userId) {
        System.out.println("User id" + userId);
        Profile profile = profileService.getProfileByUserId(userId);
        return ProfileResponse.fromEntity(profile);
    }

}


