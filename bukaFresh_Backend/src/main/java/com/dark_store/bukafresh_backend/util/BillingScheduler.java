package com.dark_store.bukafresh_backend.util;

import com.dark_store.bukafresh_backend.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class BillingScheduler {

    private final SubscriptionService subscriptionService;

    @Scheduled(cron = "0 0 0 * * ?") // Run daily at midnight
    public void runDailyBilling() {
        log.info("Starting daily billing process");
        try {
            subscriptionService.processDueSubscriptions();
            log.info("Daily billing process completed successfully");
        } catch (Exception e) {
            log.error("Error during daily billing process: {}", e.getMessage(), e);
        }
    }
}
