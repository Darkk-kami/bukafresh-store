package com.dark_store.bukafresh_backend.service.clients;

import com.dark_store.bukafresh_backend.config.OnePipeProperties;
import com.dark_store.bukafresh_backend.dto.onePipe.request.CreateMandateRequest;
import com.dark_store.bukafresh_backend.dto.request.CreatePaymentMandateRequest;
import com.dark_store.bukafresh_backend.dto.onePipe.response.OnePipeResponse;
import com.dark_store.bukafresh_backend.util.MD5Hash;
import com.dark_store.bukafresh_backend.util.TripleDES;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class OnePipeMandateClient {

    private final WebClient webClient;
    private final OnePipeProperties props;
    private String mockMode;

    public Mono<OnePipeResponse> createMandate(CreatePaymentMandateRequest request
//            String accountNumber,
//            String bankCode,
//            String bvn,
//            String firstName,
//            String surname,
//            String email,
//            String phone,
//            Long firstPaymentAmountKobo,
//            String recurringAmountKobo
    ) {
        String accountNumber = request.getBankAccount().getAccountNumber();
        String bankCode = request.getBankAccount().getBankCode();
        String phone = request.getPhone();
        String bvn = request.getBvn();
        BigDecimal firstPaymentAmountKobo = request.getAmount();
        String recurringAmountKobo = request.getAmount().toString();


        validateInputs(accountNumber, bankCode, bvn, phone, firstPaymentAmountKobo);

        String requestRef = generateRef("REQ");
        String transactionRef = generateRef("TXN");

        CreateMandateRequest payload = buildRequest(
                requestRef,
                transactionRef,
                accountNumber,
                bankCode,
                bvn,
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                phone,
                firstPaymentAmountKobo,
                recurringAmountKobo
        );

        return sendRequest(requestRef, payload);
    }


    private Mono<OnePipeResponse> sendRequest(String requestRef, CreateMandateRequest payload) {
        return webClient
                .post()
                .uri(props.getBaseUrl() + "/v2/transact")
                .header("Authorization", "Bearer " + props.getBearerToken())
                .header("Signature", MD5Hash.generate(requestRef, props.getClientSecret()))
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(OnePipeResponse.class);
    }

    private CreateMandateRequest buildRequest(
            String requestRef,
            String transactionRef,
            String accountNumber,
            String bankCode,
            String bvn,
            String firstName,
            String surname,
            String email,
            String phone,
            BigDecimal firstPaymentAmountKobo,
            String recurringAmountKobo
    ) {

        String encryptedAccount = TripleDES.encrypt(
                accountNumber,
                bankCode,
                props.getEncryptionKey()
        );

        String encryptedBvn = TripleDES.encrypt(
                bvn,
                props.getEncryptionKey()
        );

        return CreateMandateRequest.builder()
                .request_ref(requestRef)
                .request_type("create mandate")
                .auth(
                        CreateMandateRequest.Auth.builder()
                                .type("bank.account")
                                .secure(encryptedAccount)
                                .auth_provider("PaywithAccount")
                                .build()
                )
                .transaction(
                        CreateMandateRequest.Transaction.builder()
                                .mock_mode(props.getMockMode())
                                .transaction_ref(transactionRef)
                                .transaction_desc("BukaFresh Subscription Mandate")
                                .transaction_ref_parent(null)
                                .amount(firstPaymentAmountKobo)
                                .customer(
                                        CreateMandateRequest.Customer.builder()
                                                .customer_ref(phone)
                                                .firstname(firstName)
                                                .surname(surname)
                                                .email(email)
                                                .mobile_no(phone)
                                                .build()
                                )
                                .meta(
                                        CreateMandateRequest.Meta.builder()
                                                .amount(recurringAmountKobo)
                                                .skip_consent("true")
                                                .bvn(encryptedBvn)
                                                .biller_code(props.getBillerCode())
                                                .customer_consent("")
                                                .build()
                                )
                                .details(new HashMap<>())
                                .build()
                )
                .build();
    }

    private void validateInputs(
            String accountNumber,
            String bankCode,
            String bvn,
            String phone,
            BigDecimal amount
    ) {
        if (accountNumber == null || accountNumber.length() != 10)
            throw new IllegalArgumentException("Invalid account number");

        if (bankCode == null || bankCode.length() != 3)
            throw new IllegalArgumentException("Invalid bank code");

        if (bvn == null || bvn.length() != 11)
            throw new IllegalArgumentException("Invalid BVN");

        if (phone == null || !phone.startsWith("234"))
            throw new IllegalArgumentException("Invalid phone number");

       validateAmount(amount);
    }

    private void validateAmount(BigDecimal amount) {
        if (amount == null) {
            throw new IllegalArgumentException("Amount cannot be null");
        }

        if (amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Amount cannot be negative: " + amount);
        }

        if (amount.compareTo(BigDecimal.ZERO) == 0) {
            throw new IllegalArgumentException("Amount cannot be zero");
        }

        if (amount.compareTo(new BigDecimal("1000000000")) > 0) {
            throw new IllegalArgumentException("Amount is too large: " + amount);
        }
    }

    public String processDirectDebit(
            String paymentReference,
            String bvn,
            String accountNumber,
            String bankName,
            String phoneNumber,
            String firstName,
            String lastName,
            BigDecimal amount
    ) {
        // For now, simulate OnePipe direct debit call
        // In production, this would make actual API call to OnePipe
        
        log.info("Processing direct debit for payment reference: {}", paymentReference);
        log.info("Amount: {}, Account: {}, Bank: {}", amount, maskAccountNumber(accountNumber), bankName);
        
        try {
            // Simulate API call delay
            Thread.sleep(2000);
            
            // Simulate success response (90% success rate for demo)
            if (Math.random() > 0.1) {
                String mockResponse = String.format(
                    "{\"status\":\"SUCCESS\",\"reference\":\"%s\",\"amount\":\"%s\",\"message\":\"Payment successful\"}",
                    paymentReference, amount
                );
                log.info("Direct debit successful for reference: {}", paymentReference);
                return mockResponse;
            } else {
                throw new RuntimeException("Insufficient funds");
            }
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Payment processing interrupted");
        } catch (Exception e) {
            log.error("Direct debit failed for reference {}: {}", paymentReference, e.getMessage());
            throw new RuntimeException("Payment failed: " + e.getMessage());
        }
    }

    private String maskAccountNumber(String accountNumber) {
        if (accountNumber == null || accountNumber.length() < 4) {
            return "****";
        }
        return "******" + accountNumber.substring(accountNumber.length() - 4);
    }

    private String generateRef(String prefix) {
        return prefix + "_" + UUID.randomUUID();
    }
}
