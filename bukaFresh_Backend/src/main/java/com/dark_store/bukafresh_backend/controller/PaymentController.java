package com.dark_store.bukafresh_backend.controller;

import com.dark_store.bukafresh_backend.dto.request.ProcessPaymentRequest;
import com.dark_store.bukafresh_backend.dto.response.ApiResponse;
import com.dark_store.bukafresh_backend.dto.response.PaymentResponse;
import com.dark_store.bukafresh_backend.service.PaymentService;
import com.dark_store.bukafresh_backend.util.CurrentUserUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/process")
    public ResponseEntity<ApiResponse<PaymentResponse>> processPayment(
            @Valid @RequestBody ProcessPaymentRequest request) {
        
        log.info("Processing payment for subscription: {}", request.getSubscriptionId());
        
        PaymentResponse response = paymentService.processPayment(request);
        
        return ResponseEntity.ok(ApiResponse.<PaymentResponse>builder()
                .success(true)
                .message("Payment processed successfully")
                .data(response)
                .build());
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPayment(@PathVariable String paymentId) {
        PaymentResponse response = paymentService.getPaymentById(paymentId);
        
        return ResponseEntity.ok(ApiResponse.<PaymentResponse>builder()
                .success(true)
                .message("Payment retrieved successfully")
                .data(response)
                .build());
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getUserPayments() {
        String userId = CurrentUserUtil.getCurrentUserId();
        List<PaymentResponse> payments = paymentService.getUserPayments(userId);
        
        return ResponseEntity.ok(ApiResponse.<List<PaymentResponse>>builder()
                .success(true)
                .message("User payments retrieved successfully")
                .data(payments)
                .build());
    }

    @GetMapping("/subscription/{subscriptionId}")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getSubscriptionPayments(
            @PathVariable String subscriptionId) {
        
        List<PaymentResponse> payments = paymentService.getSubscriptionPayments(subscriptionId);
        
        return ResponseEntity.ok(ApiResponse.<List<PaymentResponse>>builder()
                .success(true)
                .message("Subscription payments retrieved successfully")
                .data(payments)
                .build());
    }

    @PostMapping("/callback/onepipe")
    public ResponseEntity<ApiResponse<PaymentResponse>> handleOnePipeCallback(
            @RequestParam String reference,
            @RequestParam String status,
            @RequestBody String response) {
        
        log.info("Received OnePipe callback for reference: {} with status: {}", reference, status);
        
        PaymentResponse paymentResponse = paymentService.handleOnePipeCallback(reference, status, response);
        
        return ResponseEntity.ok(ApiResponse.<PaymentResponse>builder()
                .success(true)
                .message("Callback processed successfully")
                .data(paymentResponse)
                .build());
    }
}