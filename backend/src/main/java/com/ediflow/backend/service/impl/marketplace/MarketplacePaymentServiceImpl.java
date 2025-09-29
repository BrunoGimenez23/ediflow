package com.ediflow.backend.service.impl.marketplace;

import com.ediflow.backend.entity.marketplace.ServiceOrder;
import com.ediflow.backend.entity.marketplace.Provider;
import com.ediflow.backend.enums.marketplace.OrderStatus;
import com.ediflow.backend.repository.marketplace.OrderRepository;
import com.ediflow.backend.repository.marketplace.ProviderRepository;
import com.ediflow.backend.service.marketplace.MarketplacePaymentService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mercadopago.MercadoPagoConfig;
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
import org.springframework.stereotype.Service;

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

    // Token de producción
    private static final String MP_TOKEN_PROD = "APP_USR-6454226836460176-070819-a786a2a17c080291233853e9fada9869-59994041";

    // URLs producción
    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.backend.url}")
    private String backendUrl;

    @PostConstruct
    public void init() {
        this.paymentClient = new PaymentClient();
        MercadoPagoConfig.setAccessToken(MP_TOKEN_PROD);
        log.info("Mercado Pago configurado para producción con token {}...", MP_TOKEN_PROD.substring(0, 10));
    }

    @Override
    public String createCheckout(Long orderId) {
        try {
            ServiceOrder order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

            Provider provider = providerRepository.findById(order.getProviderId())
                    .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

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
            Payment payment = paymentClient.get(paymentId);

            Long orderId = Long.valueOf(payment.getExternalReference());
            ServiceOrder order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Orden no encontrada"));

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
}
