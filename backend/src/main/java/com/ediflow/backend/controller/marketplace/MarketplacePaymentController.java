package com.ediflow.backend.controller.marketplace;

import com.ediflow.backend.entity.marketplace.Provider;
import com.ediflow.backend.repository.marketplace.ProviderRepository;
import com.ediflow.backend.service.marketplace.MarketplacePaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.Map;

@RestController
@RequestMapping("/marketplace")
@RequiredArgsConstructor
public class MarketplacePaymentController {

    private final MarketplacePaymentService paymentService;
    private final ProviderRepository providerRepository;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    // 🔹 Credenciales producción Mercado Pago
    private static final String CLIENT_ID = "6454226836460176";
    private static final String CLIENT_SECRET = "U1VcT34dzWTtxL6MHozt7mIRnfrHinC9";

    // --- Checkout y webhook existentes ---
    @PostMapping("/payment/checkout/{orderId}")
    public ResponseEntity<Map<String, String>> checkout(@PathVariable Long orderId) {
        try {
            String initPoint = paymentService.createCheckout(orderId);
            return ResponseEntity.ok(Map.of("init_point", initPoint));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/payment/webhook")
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

    // --- OAuth proveedores ---
    @GetMapping("/providers/oauth-url")
    public String getOAuthUrl() {
        String redirectUri = frontendUrl + "/providers/oauth-callback";
        return "https://www.mercadopago.com.uy/developers/panel/credentials/oauth/authorize" +
                "?client_id=" + CLIENT_ID +
                "&response_type=code" +
                "&platform_id=mp" +
                "&redirect_uri=" + redirectUri;
    }

    @PostMapping("/providers/oauth-callback")
    public ResponseEntity<String> oauthCallback(@RequestParam String code) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://api.mercadopago.com/oauth/token";

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", CLIENT_ID);
            params.add("client_secret", CLIENT_SECRET);
            params.add("code", code);
            params.add("redirect_uri", frontendUrl + "/providers/oauth-callback");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            Map<String, Object> body = response.getBody();

            String accessToken = (String) body.get("access_token");
            String refreshToken = (String) body.get("refresh_token");
            String mpAccountId = String.valueOf(body.get("user_id"));

            // Guardar tokens en Provider
            Provider provider = new Provider();
            provider.setMpAccessToken(accessToken);
            provider.setMpRefreshToken(refreshToken);
            provider.setMpAccountId(mpAccountId);
            provider.setVerified(true);
            providerRepository.save(provider);

            return ResponseEntity.ok("Proveedor registrado correctamente");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error registrando proveedor: " + e.getMessage());
        }
    }
    // --- Obtener info del proveedor logueado ---
    @GetMapping("/providers/me")
    public ResponseEntity<Provider> getLoggedProvider(@RequestParam(required = false) Long providerId) {
        try {
            // Si viene providerId lo usamos (para pruebas), sino tomamos el primero
            Provider provider;
            if (providerId != null) {
                provider = providerRepository.findById(providerId)
                        .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
            } else {
                // Para simplificar: tomamos el primer proveedor registrado (en producción usar auth)
                provider = providerRepository.findAll().stream().findFirst()
                        .orElse(null);
            }

            if (provider == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            return ResponseEntity.ok(provider);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
