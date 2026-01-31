package com.dark_store.bukafresh_backend.dto.onePipe.response;


import lombok.Data;

@Data
public class OnePipeResponse {
    private String status;
    private String response_code;
    private String message;
    private Object data;
}
