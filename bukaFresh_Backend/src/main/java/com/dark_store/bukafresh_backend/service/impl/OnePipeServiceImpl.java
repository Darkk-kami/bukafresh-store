//package com.dark_store.bukafresh_backend.service.impl;
//
//import com.dark_store.bukafresh_backend.dto.request.CreateSubscriptionRequest;
//import com.dark_store.bukafresh_backend.service.OnePipeService;
//import com.dark_store.bukafresh_backend.service.clients.OnePipeMandateClient;
//import lombok.RequiredArgsConstructor;
//import org.springframework.scheduling.annotation.Async;
//import org.springframework.stereotype.Service;
//
//import java.math.BigDecimal;
//import java.util.concurrent.CompletableFuture;
//
//@Service
//@RequiredArgsConstructor
//public class OnePipeServiceImpl implements OnePipeService {
//
//    private final OnePipeMandateClient mandateClient;
//
//    @Async
//    @Override
//    public CompletableFuture<String> createMandate(CreateSubscriptionRequest request) {
//        return mandateClient.createMandate(request)
//                .map(response -> {
//                    // Extract mandate ID from response
//                    // Or handle the response as needed
//                    return response.getMandateId();
//                })
//                .toFuture();        return CompletableFuture.completedFuture(mandateId);
//    }
//
//    @Async
//    @Override
//    public CompletableFuture<Boolean> collect(String mandateId, BigDecimal amount) {
//        // TODO: Call OnePipe collect API
//        System.out.println("Collecting payment for mandate: " + mandateId);
//        return CompletableFuture.completedFuture(true); // true if successful
//    }
//
//    @Async
//    @Override
//    public CompletableFuture<String> createAddOnInvoice(String userId, BigDecimal amount, String description) {
//        System.out.println("Creating add-on invoice for user: " + userId);
//        String invoiceId = "mock-invoice-id-" + userId;
//        return CompletableFuture.completedFuture(invoiceId);
//    }
//
//
//}
