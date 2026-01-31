package com.dark_store.bukafresh_backend.repository;

import com.dark_store.bukafresh_backend.model.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
    List<Payment> findByUserId(String userId);
    List<Payment> findBySubscriptionId(String subscriptionId);
    Optional<Payment> findByPaymentReference(String paymentReference);
    Optional<Payment> findByOnePipeReference(String onePipeReference);
    List<Payment> findByStatus(String status);
}