package com.ediflow.backend.controller.marketplace;

import com.ediflow.backend.service.marketplace.MarketplacePaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/marketplace/payment")
@RequiredArgsConstructor
public class MarketplacePaymentController {

    private final MarketplacePaymentService paymentService;

    @PostMapping("/checkout/{orderId}")
    public ResponseEntity<Map<String, String>> checkout(@PathVariable Long orderId) {
        try {
            String initPoint = paymentService.createCheckout(orderId);
            return ResponseEntity.ok(Map.of("init_point", initPoint));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> webhook(@RequestBody String rawBody) {
        System.out.println("🔔 Webhook recibido: " + rawBody);

        try {
            paymentService.handleWebhook(rawBody);
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok("Received with errors"); // siempre 200 para Mercado Pago
        }
    }

}
