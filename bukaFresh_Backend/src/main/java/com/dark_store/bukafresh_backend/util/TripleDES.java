package com.dark_store.bukafresh_backend.util;

import org.apache.commons.codec.binary.Base64;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Arrays;

public final class TripleDES {

    private TripleDES(){}

    public static String encrypt(String accountNumber, String cbnBankCode, String secretKey) {

        try {
            String payload = accountNumber + ";" + cbnBankCode;

            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(
                    secretKey.getBytes(StandardCharsets.UTF_16LE)
            );

            byte[] keyBytes = Arrays.copyOf(digest, 24);
            for (int j = 0, k = 16; j < 8;) {
                keyBytes[k++] = keyBytes[j++];
            }

            // 3. Create Triple DES key
            SecretKey secretKeySpec =
                    new SecretKeySpec(keyBytes, "DESede");

            IvParameterSpec iv = new IvParameterSpec(new byte[8]);

            Cipher cipher =
                    Cipher.getInstance("DESede/CBC/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, iv);

            // 6. Encrypt payload
            byte[] encrypted =
                    cipher.doFinal(payload.getBytes(StandardCharsets.UTF_16LE));

            return Base64.encodeBase64String(encrypted);

        } catch (Exception e) {
            throw new IllegalStateException(
                    "TripleDES encryption failed", e
            );
        }
    }

    public static String encrypt(String payload, String secretKey) {

        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(
                    secretKey.getBytes(StandardCharsets.UTF_16LE)
            );

            byte[] keyBytes = Arrays.copyOf(digest, 24);
            for (int j = 0, k = 16; j < 8;) {
                keyBytes[k++] = keyBytes[j++];
            }

            // 3. Create Triple DES key
            SecretKey secretKeySpec =
                    new SecretKeySpec(keyBytes, "DESede");

            IvParameterSpec iv = new IvParameterSpec(new byte[8]);

            Cipher cipher =
                    Cipher.getInstance("DESede/CBC/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, iv);

            // 6. Encrypt payload
            byte[] encrypted =
                    cipher.doFinal(payload.getBytes(StandardCharsets.UTF_16LE));

            return Base64.encodeBase64String(encrypted);

        } catch (Exception e) {
            throw new IllegalStateException(
                    "TripleDES encryption failed", e
            );
        }
    }
}