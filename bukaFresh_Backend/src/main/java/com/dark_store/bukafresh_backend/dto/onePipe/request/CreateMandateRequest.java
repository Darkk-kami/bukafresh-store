package com.dark_store.bukafresh_backend.dto.onePipe.request;


import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
public class CreateMandateRequest {

    private String request_ref;
    private String request_type;
    private Auth auth;
    private Transaction transaction;

    @Data
    @Builder
    public static class Auth {
        private String type;
        private String secure;
        private String auth_provider;
    }

    @Data
    @Builder
    public static class Transaction {
        private String mock_mode;
        private String transaction_ref;
        private String transaction_desc;
        private String transaction_ref_parent;
        private BigDecimal amount;
        private Customer customer;
        private Meta meta;
        private Map<String, Object> details;
    }

    @Data
    @Builder
    public static class Customer {
        private String customer_ref;
        private String firstname;
        private String surname;
        private String email;
        private String mobile_no;
    }

    @Data
    @Builder
    public static class Meta {
        private String amount;
        private String skip_consent;
        private String bvn;
        private String biller_code;
        private String customer_consent;
    }
}
