package com.dark_store.bukafresh_backend.config;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "onepipe")
@Data
public class OnePipeProperties {

    private String baseUrl;
    private String clientId;
    private String clientSecret;
    private String encryptionKey;
    private String billerCode;
    private String bearerToken;
    private String mockMode;
}
