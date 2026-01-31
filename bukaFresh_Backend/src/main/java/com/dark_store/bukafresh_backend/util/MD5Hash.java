package com.dark_store.bukafresh_backend.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

public final class MD5Hash {

    private MD5Hash() {}
    public static String generate(String requestRef, String clientSecret) {
        try {
            String payload = requestRef + ";" + clientSecret;

            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(payload.getBytes(StandardCharsets.UTF_8));

            return toHex(digest);

        } catch (Exception e) {
            throw new IllegalStateException(
                    "Failed to generate OnePipe signature", e
            );
        }
    }

    private static String toHex(byte[] bytes) {
        StringBuilder hex = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) {
            hex.append(String.format("%02x", b));
        }
        return hex.toString();
    }
}

