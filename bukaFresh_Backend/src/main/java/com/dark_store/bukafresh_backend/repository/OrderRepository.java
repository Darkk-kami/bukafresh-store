package com.dark_store.bukafresh_backend.repository;

import com.dark_store.bukafresh_backend.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
}
