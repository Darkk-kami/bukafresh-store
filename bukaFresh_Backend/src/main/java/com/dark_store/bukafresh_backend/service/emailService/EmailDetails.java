package com.dark_store.bukafresh_backend.service.emailService;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmailDetails {
    private String recipient;
    private String subject;
    private String messageBody;
    private String attachments;
    @Builder.Default
    private boolean isHtml = false;
}
