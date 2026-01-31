package com.dark_store.bukafresh_backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {


        System.out.println("JWT Filter processing request: " + request.getMethod() + " " + request.getRequestURI());
        
        final String authHeader = request.getHeader("Authorization");
        final String userId;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("No Authorization header or not Bearer token, proceeding without authentication");
            filterChain.doFilter(request, response);
            return;
        }


        System.out.println("Processing JWT token...");

        String token = authHeader.substring(7);

        if (!jwtUtil.validateToken(token)) {
            System.out.println("JWT token validation failed");
            filterChain.doFilter(request, response);
            return;
        }
        userId = jwtUtil.extractUsername(token);
        List<String> permissions = jwtUtil.extractPermissions(token);

        var authorities = permissions.stream()
                .map(SimpleGrantedAuthority::new)
                .toList();
        UserDetails userDetails = userDetailsService.loadUserByUsername(userId);

        if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, authorities
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("JWT token validated and authentication set for user: " + userId);
        }
        filterChain.doFilter(request, response);
    }
} 