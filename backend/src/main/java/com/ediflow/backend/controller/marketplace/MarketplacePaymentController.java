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
    public ResponseEntity<Map<String, String>> getOAuthUrl() {
        var user = userService.getLoggedUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        Provider provider = providerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

        // Redirect URI exacto registrado en Mercado Pago (no incluir query params aquí)
        String redirectUri = backendUrl + "/marketplace/providers/oauth-callback";

        // Usamos 'state' para pasar providerId (y en producción añadir un nonce seguro)
        String state = "providerId=" + provider.getId();
        String encodedRedirect = URLEncoder.encode(redirectUri, StandardCharsets.UTF_8);
        String encodedState = URLEncoder.encode(state, StandardCharsets.UTF_8);

        String url = "https://auth.mercadopago.com/authorization" +
                "?client_id=" + CLIENT_ID +
                "&response_type=code" +
                "&platform_id=mp" +
                "&site_id=MLU" +
                "&redirect_uri=" + encodedRedirect +
                "&state=" + encodedState;

        return ResponseEntity.ok(Map.of("url", url));
    }

    /**
     * Callback que recibe Mercado Pago (navegador -> GET ?code=...&state=...)
     * IMPORTANTE: debe ser GET porque MP redirige el browser con 302 -> GET
     */
    @GetMapping("/providers/oauth-callback")
    public ResponseEntity<Void> oauthCallback(@RequestParam String code,
                                              @RequestParam(required = false) String state) {
        try {
            // --- Recuperar providerId desde state (si viene) ---
            Long providerId = null;
            if (state != null && state.startsWith("providerId=")) {
                try {
                    String idStr = state.substring("providerId=".length());
                    providerId = Long.parseLong(idStr);
                } catch (Exception ex) {
                    // ignore, fallback abajo
                    providerId = null;
                }
            }

            Provider provider = null;

            // Si vino providerId en el state, usarlo (no dependemos del Authorization header aquí)
            if (providerId != null) {
                provider = providerRepository.findById(providerId)
                        .orElseThrow(() -> new RuntimeException("Proveedor no encontrado (state)"));
            } else {
                // Fallback: intentar obtener user logueado (si tenés sesión cookie)
                var user = userService.getLoggedUser();
                if (user == null) throw new RuntimeException("Usuario no logueado y no se recibió state");
                provider = providerRepository.findByUserId(user.getId())
                        .orElseThrow(() -> new RuntimeException("Proveedor no encontrado (user)"));
            }

            // --- Intercambiar código por tokens en Mercado Pago ---
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

            // --- Actualizar el proveedor existente ---
            provider.setMpAccessToken(accessToken);
            provider.setMpRefreshToken(refreshToken);
            provider.setMpAccountId(mpAccountId);
            provider.setVerified(true);

            providerRepository.save(provider);

            // Redirigir al frontend con success
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
