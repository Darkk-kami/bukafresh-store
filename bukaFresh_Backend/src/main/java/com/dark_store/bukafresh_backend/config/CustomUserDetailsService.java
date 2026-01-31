package com.dark_store.bukafresh_backend.config;

import com.dark_store.bukafresh_backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // First try to find by ID (for JWT authentication where username is actually userId)
        return userRepository.findById(username)
                .orElseGet(() -> 
                    // If not found by ID, try by email (for form-based authentication)
                    userRepository.findByEmail(username)
                        .orElseThrow(() -> new UsernameNotFoundException(username + " not found"))
                );
    }
}