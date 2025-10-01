package com.ediflow.backend.controller.marketplace;

import com.ediflow.backend.entity.marketplace.Provider;
import com.ediflow.backend.repository.marketplace.ProviderRepository;
import com.ediflow.backend.service.IUserService;
import com.ediflow.backend.service.marketplace.MarketplacePaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/marketplace")
@RequiredArgsConstructor
public class MarketplacePaymentController {

    private final MarketplacePaymentService paymentService;
    private final ProviderRepository providerRepository;
    private final IUserService userService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.backend.url}")
    private String backendUrl;

    @Value("${mercadopago.client_id.prod}")
    private String clientId;

    @Value("${mercadopago.client_secret.prod}")
    private String clientSecret;

    @GetMapping("/providers/oauth-url")
    public ResponseEntity<Map<String, String>> getOAuthUrl() {
        var user = userService.getLoggedUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        Provider provider = providerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

        String redirectUri = backendUrl + "/marketplace/providers/oauth-callback";
        String state = "providerId=" + provider.getId();
        String encodedRedirect = URLEncoder.encode(redirectUri, StandardCharsets.UTF_8);
        String encodedState = URLEncoder.encode(state, StandardCharsets.UTF_8);

        String url = "https://auth.mercadopago.com.uy/authorization" +
                "?client_id=" + clientId +
                "&response_type=code" +
                "&site_id=MLU" +
                "&redirect_uri=" + encodedRedirect +
                "&state=" + encodedState;

        return ResponseEntity.ok(Map.of("url", url));
    }

    @GetMapping("/providers/oauth-callback")
    public ResponseEntity<Void> oauthCallback(@RequestParam String code,
                                              @RequestParam(required = false) String state) {
        try {
            Long providerId = null;
            if (state != null && state.startsWith("providerId=")) {
                providerId = Long.parseLong(state.substring("providerId=".length()));
            }

            Provider provider = providerRepository.findById(providerId)
                    .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

            RestTemplate restTemplate = new RestTemplate();
            String url = "https://api.mercadopago.com/oauth/token";
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", clientId);
            params.add("client_secret", clientSecret);
            params.add("code", code);
            params.add("redirect_uri", backendUrl + "/marketplace/providers/oauth-callback");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

            Map<String, Object> body = restTemplate.postForEntity(url, request, Map.class).getBody();
            provider.setMpAccessToken((String) body.get("access_token"));
            provider.setMpRefreshToken((String) body.get("refresh_token"));
            provider.setMpAccountId(String.valueOf(body.get("user_id")));
            provider.setVerified(true);

            providerRepository.save(provider);

            HttpHeaders redirectHeaders = new HttpHeaders();
            redirectHeaders.add("Location", frontendUrl + "/provider?connected=true&providerId=" + provider.getId());
            return new ResponseEntity<>(redirectHeaders, HttpStatus.FOUND);

        } catch (Exception e) {
            e.printStackTrace();
            HttpHeaders redirectHeaders = new HttpHeaders();
            redirectHeaders.add("Location", frontendUrl + "/dashboard/provider?connected=false");
            return new ResponseEntity<>(redirectHeaders, HttpStatus.FOUND);
        }
    }

    @PostMapping("/payment/checkout/{orderId}")
    public ResponseEntity<Map<String, String>> checkout(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(Map.of("init_point", paymentService.createCheckout(orderId)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/payment/webhook")
    public ResponseEntity<String> webhook(@RequestBody String rawBody) {
        try {
            paymentService.handleWebhook(rawBody);
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok("Received with errors");
        }
    }

    @GetMapping("/providers/me")
    public ResponseEntity<Provider> getLoggedProvider() {
        var user = userService.getLoggedUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        Provider provider = providerRepository.findByUserId(user.getId()).orElse(null);
        return provider != null ? ResponseEntity.ok(provider) : ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
}
