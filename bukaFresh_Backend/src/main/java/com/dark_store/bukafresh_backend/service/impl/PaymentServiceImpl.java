package com.dark_store.bukafresh_backend.service.impl;

import com.dark_store.bukafresh_backend.dto.request.ProcessPaymentRequest;
import com.dark_store.bukafresh_backend.dto.response.PaymentResponse;
import com.dark_store.bukafresh_backend.exception.BusinessException;
import com.dark_store.bukafresh_backend.exception.ResourceNotFoundException;
import com.dark_store.bukafresh_backend.model.Payment;
import com.dark_store.bukafresh_backend.model.Subscription;
import com.dark_store.bukafresh_backend.repository.PaymentRepository;
import com.dark_store.bukafresh_backend.repository.SubscriptionRepository;
import com.dark_store.bukafresh_backend.service.PaymentService;
import com.dark_store.bukafresh_backend.service.clients.OnePipeMandateClient;
import com.dark_store.bukafresh_backend.util.CurrentUserUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final OnePipeMandateClient onePipeMandateClient;

    @Override
    public PaymentResponse processPayment(ProcessPaymentRequest request) {
        String userId = CurrentUserUtil.getCurrentUserId();
        
        // Validate subscription exists and belongs to user
        Subscription subscription = subscriptionRepository.findById(request.getSubscriptionId())
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found"));
        
        if (!subscription.getUserId().equals(userId)) {
            throw new BusinessException("Subscription does not belong to current user");
        }
        
        if (!"PENDING".equals(subscription.getStatus())) {
            throw new BusinessException("Subscription is not in pending status");
        }

        try {
            // Generate payment reference
            String paymentReference = "PAY_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
            
            // Create payment record
            Payment payment = Payment.builder()
                    .userId(userId)
                    .subscriptionId(request.getSubscriptionId())
                    .amount(getSubscriptionAmount(subscription.getTier()))
                    .currency("NGN")
                    .bvn(request.getBvn())
                    .accountNumber(request.getAccountNumber())
                    .bankName(request.getBankName())
                    .phoneNumber(request.getPhoneNumber())
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .status("PROCESSING")
                    .paymentReference(paymentReference)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            Payment savedPayment = paymentRepository.save(payment);
            
            // Call OnePipe API for direct debit
            try {
                String onePipeResponse = onePipeMandateClient.processDirectDebit(
                    paymentReference,
                    request.getBvn(),
                    request.getAccountNumber(),
                    request.getBankName(),
                    request.getPhoneNumber(),
                    request.getFirstName(),
                    request.getLastName(),
                    savedPayment.getAmount()
                );
                
                // Update payment with OnePipe response
                savedPayment.setOnePipeResponse(onePipeResponse);
                savedPayment.setStatus("PAID");
                savedPayment.setPaidAt(LocalDateTime.now());
                savedPayment.setUpdatedAt(LocalDateTime.now());
                
                // Update subscription status to ACTIVE
                subscription.setStatus("ACTIVE");
                subscription.setUpdatedAt(LocalDateTime.now());
                subscriptionRepository.save(subscription);
                
                savedPayment = paymentRepository.save(savedPayment);
                
                log.info("Payment processed successfully for subscription {}", request.getSubscriptionId());
                
            } catch (Exception onePipeError) {
                log.error("OnePipe payment failed for payment {}: {}", paymentReference, onePipeError.getMessage());
                
                // Update payment status to FAILED
                savedPayment.setStatus("FAILED");
                savedPayment.setFailureReason(onePipeError.getMessage());
                savedPayment.setUpdatedAt(LocalDateTime.now());
                savedPayment = paymentRepository.save(savedPayment);
                
                throw new BusinessException("Payment processing failed: " + onePipeError.getMessage());
            }
            
            return mapToResponse(savedPayment);
            
        } catch (Exception e) {
            log.error("Failed to process payment for subscription {}: {}", request.getSubscriptionId(), e.getMessage());
            throw new BusinessException("Failed to process payment: " + e.getMessage());
        }
    }

    @Override
    public PaymentResponse getPaymentById(String paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        
        String userId = CurrentUserUtil.getCurrentUserId();
        if (!payment.getUserId().equals(userId)) {
            throw new BusinessException("Payment does not belong to current user");
        }
        
        return mapToResponse(payment);
    }

    @Override
    public List<PaymentResponse> getUserPayments(String userId) {
        List<Payment> payments = paymentRepository.findByUserId(userId);
        return payments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PaymentResponse> getSubscriptionPayments(String subscriptionId) {
        List<Payment> payments = paymentRepository.findBySubscriptionId(subscriptionId);
        return payments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PaymentResponse handleOnePipeCallback(String onePipeReference, String status, String response) {
        Payment payment = paymentRepository.findByOnePipeReference(onePipeReference)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for OnePipe reference"));
        
        payment.setOnePipeResponse(response);
        payment.setUpdatedAt(LocalDateTime.now());
        
        if ("SUCCESS".equalsIgnoreCase(status)) {
            payment.setStatus("PAID");
            payment.setPaidAt(LocalDateTime.now());
            
            // Update subscription status to ACTIVE
            Subscription subscription = subscriptionRepository.findById(payment.getSubscriptionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subscription not found"));
            subscription.setStatus("ACTIVE");
            subscription.setUpdatedAt(LocalDateTime.now());
            subscriptionRepository.save(subscription);
            
        } else {
            payment.setStatus("FAILED");
            payment.setFailureReason("OnePipe payment failed: " + status);
        }
        
        Payment updatedPayment = paymentRepository.save(payment);
        return mapToResponse(updatedPayment);
    }

    private BigDecimal getSubscriptionAmount(String tier) {
        return switch (tier.toUpperCase()) {
            case "ESSENTIALS" -> new BigDecimal("80000");
            case "STANDARD" -> new BigDecimal("140000");
            case "PREMIUM" -> new BigDecimal("200000");
            default -> new BigDecimal("140000");
        };
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .userId(payment.getUserId())
                .subscriptionId(payment.getSubscriptionId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus())
                .paymentReference(payment.getPaymentReference())
                .bankName(payment.getBankName())
                .accountNumber(maskAccountNumber(payment.getAccountNumber()))
                .createdAt(payment.getCreatedAt())
                .paidAt(payment.getPaidAt())
                .failureReason(payment.getFailureReason())
                .build();
    }

    private String maskAccountNumber(String accountNumber) {
        if (accountNumber == null || accountNumber.length() < 4) {
            return "****";
        }
        return "******" + accountNumber.substring(accountNumber.length() - 4);
    }
}