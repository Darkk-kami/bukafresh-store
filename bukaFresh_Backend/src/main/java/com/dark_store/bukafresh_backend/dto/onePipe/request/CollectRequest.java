package com.dark_store.bukafresh_backend.dto.onePipe.request;


import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class CollectRequest {

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
        private String transaction_ref;
        private Long amount;
        private Customer customer;
        private Map<String, Object> meta;
    }

    @Data
    @Builder
    public static class Customer {
        private String customer_ref;
        private String first_name;
        private String last_name;
        private String mobile_no;
    }
}
