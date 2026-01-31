package com.dark_store.bukafresh_backend.service.impl;

import com.dark_store.bukafresh_backend.model.User;
import org.springframework.beans.factory.annotation.Value;
import com.dark_store.bukafresh_backend.service.SecurityAlertService;
import com.dark_store.bukafresh_backend.service.emailService.EmailDetails;
import com.dark_store.bukafresh_backend.service.emailService.IEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SecurityAlertServiceImpl implements SecurityAlertService {

    private final IEmailService emailService;
    private final String frontendUrl;

    public SecurityAlertServiceImpl(IEmailService emailService,
                                    @Value("${frontend_url}") String frontendUrl) {
        this.emailService = emailService;
        this.frontendUrl = frontendUrl;
    }

    @Async
    @Override
    public void sendNewDeviceLoginAlert(String email, String ip, String userAgent) {

        String html = """
                <p>Hello,</p>

                <p>A new login to your BukaFresh account just occurred.</p>

                <p><b>Details:</b></p>
                <ul>
                  <li><b>IP:</b> %s</li>
                  <li><b>Device:</b> %s</li>
                  <li><b>Time:</b> %s</li>
                </ul>

                <p>If this was <b>NOT</b> you, please update your password immediately
                and contact customer support.</p>

                <p>Kind regards,<br>
                BukaFresh Security Team</p>
                """.formatted(ip, userAgent, LocalDateTime.now());

        EmailDetails details = EmailDetails.builder()
                .recipient(email)
                .subject("Security Alert: New Login Detected")
                .messageBody(html)
                .isHtml(true)
                .build();

        emailService.sendEmailAlert(details);
    }

    @Async
    @Override
    public void SendEmailVerificationToNewUser(User savedUser, String token) {
        String userId = savedUser.getId();
        String verificationUrl = String.format("%s/verify-email?userId=%s&token=%s", frontendUrl, userId, token);
        System.out.println("verification url: " + verificationUrl);

        String htmlBody = """
        <html>
        <body style="font-family:Arial, sans-serif; line-height:1.6;">
            <p>Hello,</p>

            <p>Welcome to BukaFresh 🎉</p>

            <p>To activate your account, please verify your email address:</p>

            <p>
                <a href="%s"
                   style="display:inline-block;
                          padding:5px 10px;
                          font-size:16px;
                          font-weight:600;
                          background-color:#2563eb;
                          color:#ffffff;
                          text-decoration:none;
                          border-radius:5px;">
                    Verify Email
                </a>
            </p>

            <p>This link expires in 30 minutes.</p>

            <p>If you didn't register this account, please ignore this email.</p>

            <br/>
            <p>Kind regards,<br/>BukaFresh Customer Success Team</p>
        </body>
        </html>
        """.formatted(verificationUrl);

        EmailDetails emailDetails = EmailDetails.builder()
                .recipient(savedUser.getEmail())
                .subject("Verify your BukaFresh Account")
                .messageBody(htmlBody)
                .isHtml(true)
                .build();

        emailService.sendEmailAlert(emailDetails);
    }
}
