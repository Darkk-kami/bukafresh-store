package com.dark_store.bukafresh_backend.util;

import com.dark_store.bukafresh_backend.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class CurrentUserUtil {
    
    public static String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            
            // Cast to our User model to get the actual user ID
            if (userDetails instanceof User) {
                User user = (User) userDetails;
                return user.getId();
            }
        }
        
        throw new RuntimeException("No authenticated user found");
    }
    
    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated() && 
               !(authentication.getPrincipal() instanceof String && 
                 "anonymousUser".equals(authentication.getPrincipal()));
    }
}