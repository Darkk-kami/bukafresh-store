package com.dark_store.bukafresh_backend.repository;

import com.dark_store.bukafresh_backend.model.Subscription;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface SubscriptionRepository extends MongoRepository<Subscription, String> {
    List<Subscription> findByNextBillingDate(LocalDate date);

    List<Subscription> findByUserId(String userId);
}
