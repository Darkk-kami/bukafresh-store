package com.dark_store.bukafresh_backend.repository;

import com.dark_store.bukafresh_backend.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProductRepository extends MongoRepository<Product, String> {
}