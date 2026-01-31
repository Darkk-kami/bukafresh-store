package com.dark_store.bukafresh_backend.repository;

import com.dark_store.bukafresh_backend.model.Address;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AddressRepository extends MongoRepository<Address, String> {

}
