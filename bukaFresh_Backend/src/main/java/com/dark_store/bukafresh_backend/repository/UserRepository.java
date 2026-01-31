package com.dark_store.bukafresh_backend.repository;

import com.dark_store.bukafresh_backend.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;


public interface UserRepository extends MongoRepository<User,String> {
    boolean existsByEmail(@NotBlank @Email @Size(max = 255) String email);

    Optional<User> findByEmail(String email);

}
