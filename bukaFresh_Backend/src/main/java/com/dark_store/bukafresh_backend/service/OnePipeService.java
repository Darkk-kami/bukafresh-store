//package com.dark_store.bukafresh_backend.service;
//
//import com.dark_store.bukafresh_backend.dto.request.CreateSubscriptionRequest;
//import org.springframework.scheduling.annotation.Async;
//
//import java.math.BigDecimal;
//import java.util.concurrent.CompletableFuture;
//
//public interface OnePipeService {
//
//
//    @Async
//    CompletableFuture<String> createMandate(String userId, String tier, BigDecimal amount);
//
//    @Async
//    CompletableFuture<String> createMandate(CreateSubscriptionRequest request);
//
//    @Async
//    CompletableFuture<Boolean> collect(String mandateId, BigDecimal amount);
//
//    @Async
//    CompletableFuture<String> createAddOnInvoice(String userId, BigDecimal amount, String description);
//}
