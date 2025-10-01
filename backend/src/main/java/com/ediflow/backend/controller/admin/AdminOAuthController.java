package com.ediflow.backend.controller.admin;

import com.ediflow.backend.entity.Admin;
import com.ediflow.backend.repository.IAdminRepository;
import com.ediflow.backend.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/admin/mercadopago")
@RequiredArgsConstructor
public class AdminOAuthController {

    private final IAdminRepository adminRepository;
    private final IUserService userService;

    @Value("${mercadopago.env}")
    private String mpEnv;

    @Value("${mercadopago.client_id.prod}")
    private String clientIdProd;

    @Value("${mercadopago.client_secret.prod}")
    private String clientSecretProd;

    @Value("${mercadopago.client_id.sandbox}")
    private String clientIdSandbox;

    @Value("${mercadopago.client_secret.sandbox}")
    private String clientSecretSandbox;

    @Value("${app.backend.url}")
    private String backendUrl;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    private String getClientId() {
        return "prod".equalsIgnoreCase(mpEnv) ? clientIdProd : clientIdSandbox;
    }

    private String getClientSecret() {
        return "prod".equalsIgnoreCase(mpEnv) ? clientSecretProd : clientSecretSandbox;
    }

    // --- Paso 1: generar URL de conexión ---
    @GetMapping("/connect")
    public ResponseEntity<Map<String, String>> connect() {
        Admin admin = userService.getLoggedAdmin(); // 🔹 obtenemos el admin logueado

        String redirectUri = backendUrl + "/admin/mercadopago/oauth-callback";
        String state = "adminId=" + admin.getId(); // opcional, solo para referencia

        String encodedRedirect = URLEncoder.encode(redirectUri, StandardCharsets.UTF_8);
        String encodedState = URLEncoder.encode(state, StandardCharsets.UTF_8);

        String url = "https://auth.mercadopago.com.uy/authorization" +
                "?client_id=" + getClientId() +
                "&response_type=code" +
                "&redirect_uri=" + encodedRedirect +
                "&state=" + encodedState;

        return ResponseEntity.ok(Map.of("url", url));
    }

    // --- Paso 2: callback de MercadoPago ---
    @GetMapping("/oauth-callback")
    public ResponseEntity<Void> oauthCallback(@RequestParam String code,
                                              @RequestParam String state) {

        Long adminId = Long.valueOf(state.split("=")[1]); // opcional, solo referencia
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin no encontrado"));

        String tokenUrl = "https://api.mercadopago.com/oauth/token";

        RestTemplate restTemplate = new RestTemplate();
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("client_id", getClientId());
        params.add("client_secret", getClientSecret());
        params.add("grant_type", "authorization_code");
        params.add("code", code);
        params.add("redirect_uri", backendUrl + "/admin/mercadopago/oauth-callback");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        Map<String, Object> response = restTemplate.postForEntity(tokenUrl, request, Map.class).getBody();

        // Guardar tokens en el admin
        admin.setMpAccessToken((String) response.get("access_token"));
        admin.setMpRefreshToken((String) response.get("refresh_token"));
        admin.setMpAccountId(String.valueOf(response.get("user_id")));
        admin.setMpVerified(true);
        adminRepository.save(admin);

        // Redirigir al frontend indicando conexión exitosa
        HttpHeaders redirectHeaders = new HttpHeaders();
        redirectHeaders.add("Location", frontendUrl + "/dashboard/admin?connected=true");
        return new ResponseEntity<>(redirectHeaders, HttpStatus.FOUND);
    }
}
