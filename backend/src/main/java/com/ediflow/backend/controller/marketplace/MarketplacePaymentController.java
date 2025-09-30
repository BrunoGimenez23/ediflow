package com.ediflow.backend.controller.marketplace;

import com.ediflow.backend.entity.marketplace.Provider;
import com.ediflow.backend.repository.marketplace.ProviderRepository;
import com.ediflow.backend.service.marketplace.MarketplacePaymentService;
import com.ediflow.backend.service.IUserService; // Servicio para obtener el usuario logueado
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
    private final IUserService userService; // para obtener usuario logueado

    @Value("${app.frontend.url}")
    private String frontendUrl;


    @Value("${app.backend.url}")
    private String backendUrl;

    private static final String CLIENT_ID = "6454226836460176";
    private static final String CLIENT_SECRET = "U1VcT34dzWTtxL6MHozt7mIRnfrHinC9";

    // --- Checkout y webhook ---
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
            return ResponseEntity.ok("Received with errors");
        }
    }

    // --- OAuth proveedores ---
    @GetMapping("/providers/oauth-url")
    public ResponseEntity<Map<String, String>> getOAuthUrl(@RequestParam Long providerId) {
        // Redirect URI que debe coincidir exactamente con la app en Mercado Pago
        String redirectUri = backendUrl + "/marketplace/providers/oauth-callback?providerId=" + providerId;

        // URL de autorización usando el endpoint global (no .com.uy)
        String url = "https://auth.mercadopago.com/authorization" +
                "?client_id=" + CLIENT_ID +
                "&response_type=code" +
                "&platform_id=mp" +
                "&site_id=MLU" +  // fuerza sitio de Uruguay
                "&redirect_uri=" + redirectUri;

        return ResponseEntity.ok(Map.of("url", url));
    }




    @PostMapping("/providers/oauth-callback")
    public ResponseEntity<Void> oauthCallback(@RequestParam String code) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://api.mercadopago.com/oauth/token";

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", CLIENT_ID);
            params.add("client_secret", CLIENT_SECRET);
            params.add("code", code);
            params.add("redirect_uri", backendUrl + "/marketplace/providers/oauth-callback");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            Map<String, Object> body = response.getBody();

            String accessToken = (String) body.get("access_token");
            String refreshToken = (String) body.get("refresh_token");
            String mpAccountId = String.valueOf(body.get("user_id"));

            Provider provider = new Provider();
            provider.setMpAccessToken(accessToken);
            provider.setMpRefreshToken(refreshToken);
            provider.setMpAccountId(mpAccountId);
            provider.setVerified(true);
            providerRepository.save(provider);

            // 🔹 Redirigir al frontend con éxito
            String redirectTo = frontendUrl + "/dashboard/provider?connected=true&providerId=" + provider.getId();
            HttpHeaders redirectHeaders = new HttpHeaders();
            redirectHeaders.add("Location", redirectTo);
            return new ResponseEntity<>(redirectHeaders, HttpStatus.FOUND);

        } catch (Exception e) {
            e.printStackTrace();
            String redirectTo = frontendUrl + "/dashboard/provider?connected=false";
            HttpHeaders redirectHeaders = new HttpHeaders();
            redirectHeaders.add("Location", redirectTo);
            return new ResponseEntity<>(redirectHeaders, HttpStatus.FOUND);
        }
    }


    // --- Obtener info del proveedor logueado ---
    @GetMapping("/providers/me")
    public ResponseEntity<Provider> getLoggedProvider() {
        try {
            var user = userService.getLoggedUser();
            if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

            Provider provider = providerRepository.findByUserId(user.getId())
                    .orElse(null);

            if (provider == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            return ResponseEntity.ok(provider);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
