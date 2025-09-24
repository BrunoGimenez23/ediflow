package com.ediflow.backend.service.marketplace;

import java.util.Map;

public interface MarketplacePaymentService {
    String createCheckout(Long orderId);
    void handleWebhook(String rawBody);
}
