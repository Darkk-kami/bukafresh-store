package com.dark_store.bukafresh_backend.config;

import com.dark_store.bukafresh_backend.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class JwtUtil {
    private final long EXPIRATION;
    private final Key key;

    public JwtUtil(@Value("${jwt_secret}") String secret, @Value("${jwt_expiration}") String expiration) {

        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.EXPIRATION= Long.parseLong(expiration);
    }

    public String generateToken(User user) {
        System.out.println("User roles" + user.getAuthorities());

        List<String> roles = List.of(user.getRole().name());
        System.out.println(roles);

        List<String> permissions = user.getRole()
                .permissions()
                .stream()
                .map(Enum::name)
                .toList();


        return Jwts.builder()
                .subject(user.getId())
                .claim("roles", roles)
                .claim("email", user.getEmail())
                .claim("permissions", permissions)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String generateVerificationToken(String userId) {
        return Jwts.builder()
                .subject(userId)
                .expiration(Date.from(Instant.now().plus(30, ChronoUnit.MINUTES)))
                .claim("purpose", "EMAIL_VERIFICATION")
                .signWith(key)
                .compact();
    }

    public List<String> extractPermissions(String token) {
        Claims claims = extractAllClaims(token);
        List<?> rawList = claims.get("permissions", List.class);
        return rawList.stream()
                .map(Object::toString)
                .collect(Collectors.toList());
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }
} 