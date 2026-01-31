package com.dark_store.bukafresh_backend.service.emailService;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailSender implements IEmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String emailSender;

    @Override
    @Async
    public void sendEmailAlert(EmailDetails emailDetails) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(emailSender);
            helper.setTo(emailDetails.getRecipient());
            helper.setSubject(emailDetails.getSubject());
            helper.setText(emailDetails.getMessageBody(), emailDetails.isHtml());

            mailSender.send(message);
            System.out.println("Email sent successfully to " + emailDetails.getRecipient());

        } catch (Exception ex) {
            System.err.println("Email sending failed: " + ex.getMessage());
        }
    }
}
