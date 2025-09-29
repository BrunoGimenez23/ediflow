package com.ediflow.backend.service.impl.marketplace;

import com.ediflow.backend.entity.marketplace.ServiceOrder;
import com.ediflow.backend.entity.marketplace.Provider;
import com.ediflow.backend.enums.marketplace.OrderStatus;
import com.ediflow.backend.repository.marketplace.OrderRepository;
import com.ediflow.backend.repository.marketplace.ProviderRepository;
import com.ediflow.backend.service.marketplace.MarketplacePaymentService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class MarketplacePaymentServiceImpl implements MarketplacePaymentService {

    private final OrderRepository orderRepository;
    private final ProviderRepository providerRepository;

    private PaymentClient paymentClient;

    // OAuth de tu app
    private static final String CLIENT_ID = "6454226836460176";
    private static final String CLIENT_SECRET = "U1VcT34dzWTtxL6MHozt7mIRnfrHinC9";

    // URLs producción
    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.backend.url}")
    private String backendUrl;

    @PostConstruct
    public void init() {
        this.paymentClient = new PaymentClient();
        log.info("Mercado Pago inicializado (token por proveedor se setea dinámicamente)");
    }

    @Override
    public String createCheckout(Long orderId) {
        try {
            ServiceOrder order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

            Provider provider = providerRepository.findById(order.getProviderId())
                    .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

            // 🔹 Renovar token si es necesario
            refreshProviderTokenIfNeeded(provider);

            // 🔹 Token dinámico del proveedor
            com.mercadopago.MercadoPagoConfig.setAccessToken(provider.getMpAccessToken());
            PreferenceClient preferenceClient = new PreferenceClient();

            String itemTitle = order.getDescription() != null ? order.getDescription() : "Servicio";

            PreferenceRequest request = PreferenceRequest.builder()
                    .externalReference(orderId.toString())
                    .items(List.of(
                            PreferenceItemRequest.builder()
                                    .title(itemTitle)
                                    .description(order.getDescription() != null ? order.getDescription() : itemTitle)
                                    .quantity(1)
                                    .unitPrice(new BigDecimal(order.getTotalAmount()).setScale(2, RoundingMode.HALF_UP))
                                    .currencyId("UYU")
                                    .build()
                    ))
                    .backUrls(PreferenceBackUrlsRequest.builder()
                            .success(frontendUrl + "/success")
                            .pending(frontendUrl + "/pending")
                            .failure(frontendUrl + "/failure")
                            .build())
                    .notificationUrl(backendUrl + "/marketplace/payment/webhook")
                    .autoReturn("approved")
                    .build();

            Preference preference = preferenceClient.create(request);
            return preference.getInitPoint();

        } catch (MPException | MPApiException e) {
            log.error("Error al crear checkout de Mercado Pago", e);
            throw new RuntimeException("Error al crear checkout: " + e.getMessage(), e);
        }
    }

    @Override
    public void handleWebhook(String rawBody) {
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> payload;

        try {
            payload = mapper.readValue(rawBody, Map.class);
        } catch (JsonProcessingException e) {
            log.error("Error parseando webhook JSON", e);
            return;
        }

        Map<String, Object> data = (Map<String, Object>) payload.get("data");
        if (data == null) {
            log.warn("Webhook recibido sin campo data");
            return;
        }

        String paymentIdStr = String.valueOf(data.get("id"));
        if ("123456".equals(paymentIdStr)) {
            log.info("Webhook de prueba recibido correctamente, id=123456");
            return;
        }

        try {
            Long paymentId = Long.parseLong(paymentIdStr);

            // 🔹 Obtener orden primero para tomar token del proveedor
            Payment payment;
            Long orderId;
            ServiceOrder order;

            PaymentClient tempClient = new PaymentClient();
            payment = tempClient.get(paymentId);
            orderId = Long.valueOf(payment.getExternalReference());

            order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

            Provider provider = providerRepository.findById(order.getProviderId())
                    .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

            // 🔹 Renovar token si es necesario
            refreshProviderTokenIfNeeded(provider);

            // 🔹 Setear token del proveedor antes de consultar el pago
            com.mercadopago.MercadoPagoConfig.setAccessToken(provider.getMpAccessToken());
            payment = new PaymentClient().get(paymentId);

            switch (payment.getStatus()) {
                case "approved" -> {
                    order.setStatus(OrderStatus.PAID);
                    order.setPaid(true);
                }
                case "pending" -> order.setStatus(OrderStatus.ACCEPTED);
                case "rejected", "cancelled" -> {
                    order.setStatus(OrderStatus.REQUESTED);
                    order.setPaid(false);
                }
            }

            orderRepository.save(order);
            log.info("Orden {} actualizada correctamente según webhook", orderId);

        } catch (MPApiException | MPException e) {
            log.error("Error consultando el pago en Mercado Pago", e);
        } catch (Exception e) {
            log.error("Error procesando webhook", e);
        }
    }

    // 🔹 Método para renovar access token si caduca
    private void refreshProviderTokenIfNeeded(Provider provider) {
        try {
            if (provider.getMpAccessToken() == null || tokenExpirado(provider)) {
                RestTemplate restTemplate = new RestTemplate();
                String url = "https://api.mercadopago.com/oauth/token";

                MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
                params.add("grant_type", "refresh_token");
                params.add("client_id", CLIENT_ID);
                params.add("client_secret", CLIENT_SECRET);
                params.add("refresh_token", provider.getMpRefreshToken());

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
                HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

                ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
                Map<String, Object> body = response.getBody();

                if (body != null) {
                    String newAccessToken = (String) body.get("access_token");
                    String newRefreshToken = (String) body.get("refresh_token");

                    provider.setMpAccessToken(newAccessToken);
                    provider.setMpRefreshToken(newRefreshToken);
                    providerRepository.save(provider);

                    log.info("Token del proveedor {} renovado correctamente", provider.getId());
                }
            }
        } catch (Exception e) {
            log.error("Error renovando token del proveedor {}", provider.getId(), e);
        }
    }

    private boolean tokenExpirado(Provider provider) {
        // Por ahora siempre devuelve false; podés guardar fecha de expiración en la DB si querés
        return false;
    }
}
