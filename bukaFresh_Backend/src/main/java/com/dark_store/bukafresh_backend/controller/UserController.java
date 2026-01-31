package com.dark_store.bukafresh_backend.controller;



import com.dark_store.bukafresh_backend.dto.request.CheckoutRegisterRequest;
import com.dark_store.bukafresh_backend.dto.request.CreateUserRequest;
import com.dark_store.bukafresh_backend.dto.request.LoginRequest;
import com.dark_store.bukafresh_backend.dto.response.ApiResponse;
import com.dark_store.bukafresh_backend.dto.response.CheckoutRegisterResponse;
import com.dark_store.bukafresh_backend.dto.response.LoginResponse;
import com.dark_store.bukafresh_backend.dto.response.ProfileResponse;
import com.dark_store.bukafresh_backend.service.UserService;
import com.dark_store.bukafresh_backend.util.CurrentUserUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private static final Logger log = LoggerFactory.getLogger(UserController.class);


    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody CreateUserRequest request) {

        userService.createAccount(request);

        return ResponseEntity.ok(ApiResponse.success(
                "Registration successful. Check your email for verification"
        ));
    }

    @PostMapping("/checkout-register")
    public ResponseEntity<ApiResponse<CheckoutRegisterResponse>> checkoutRegister(
            @Valid @RequestBody CheckoutRegisterRequest request) {

         userService.checkoutRegister(request);

        return ResponseEntity.ok(ApiResponse.success(
                "Account created successfully. Check your email to verify."
        ));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse<LoginResponse>> verifyEmail(@RequestParam("token") String token,
                                                                  @RequestParam("userId") String userId) {

        LoginResponse response = userService.verifyEmail(userId, token);

       return ResponseEntity.ok(ApiResponse.success("Email verified successfully.", response));
    }

    @PostMapping("/resend-verification-email")
    public ResponseEntity<ApiResponse<Void>> resendVerificationEmail(@RequestParam("email") String email) {

        userService.resendVerificationEmail(email);

        return ResponseEntity.ok(ApiResponse.success(
                "Verification email resent. Please check your inbox."
        ));
    }



    @PostMapping(path = "/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody @Valid LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Login Successfully.",
                userService.login(request)
        ));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('USER_PROFILE_READ')")
    public ResponseEntity<ApiResponse<ProfileResponse>> getCurrentUserProfile() {
        String userId = CurrentUserUtil.getCurrentUserId();
        log.info("Fetching profile for userId: {}", userId);
        return ResponseEntity.ok(ApiResponse.success(
                "Successfully retrieved your profile.",
                userService.getCurrentUserProfile(userId)
        ));
    }

//    @GetMapping("/{id}")
//    public ResponseEntity<ApiResponse<UserResponse>> getUser(@PathVariable("id") String id) {
//        return ResponseEntity.ok(ApiResponse.success(
//                "Successfully retrieved users.",
//                userService.getUser(id)
//        ));
//    }
}


