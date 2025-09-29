package com.ediflow.backend.service.impl.payment;

import com.ediflow.backend.entity.Admin;
import com.ediflow.backend.entity.Payment;
import com.ediflow.backend.enums.PaymentStatus;
import com.ediflow.backend.exception.GlobalExceptionHandler;
import com.ediflow.backend.exception.PaymentProcessingException;
import com.ediflow.backend.repository.IAdminRepository;
import com.ediflow.backend.repository.IPaymentRepository;
import com.ediflow.backend.service.IResidentService;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.*;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResidentPaymentService {

    private final IPaymentRepository paymentRepository;
    private final IResidentService residentService;
    private final IAdminRepository adminRepository;

    private PreferenceClient preferenceClient;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.backend.url}")
    private String backendUrl;

    @Value("${mercadopago.token.sandbox}")
    private String mpTokenSandbox;

    @PostConstruct
    public void init() {
        MercadoPagoConfig.setAccessToken(mpTokenSandbox);
        this.preferenceClient = new PreferenceClient();
        log.info("ResidentPaymentService inicializado con TOKEN SANDBOX: {}", mpTokenSandbox.substring(0, 10) + "...");
    }

    /**
     * Crear preferencia de pago en Sandbox
     */
    public String createCheckout(Long paymentId, String userEmail) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));

        // Validar residente
        var residentDTO = residentService.findByUserEmail(userEmail);
        if (residentDTO == null || !residentDTO.getId().equals(payment.getResident().getId())) {
            throw new RuntimeException("No tenés permiso para pagar este expensa");
        }

        // Obtener token del Admin asociado al pago
        String mpToken = payment.getAdmin().getMpTokenSandbox(); // o mpTokenProd si estás en producción
        MercadoPagoConfig.setAccessToken(mpToken);
        this.preferenceClient = new PreferenceClient();

        try {
            // Crear preferencia de pago
            BigDecimal amount = payment.getAmount();
            PreferenceRequest request = PreferenceRequest.builder()
                    .externalReference(payment.getId().toString())
                    .items(List.of(
                            PreferenceItemRequest.builder()
                                    .title(payment.getConcept() != null ? payment.getConcept() : "Pago")
                                    .quantity(1)
                                    .unitPrice(amount)
                                    .currencyId("UYU")
                                    .build()
                    ))
                    .payer(PreferencePayerRequest.builder()
                            .email(userEmail)
                            .build())
                    .backUrls(PreferenceBackUrlsRequest.builder()
                            .success(frontendUrl + "/payments/success")
                            .pending(frontendUrl + "/payments/pending")
                            .failure(frontendUrl + "/payments/failure")
                            .build())
                    .notificationUrl(backendUrl + "/payment/webhook")
                    .autoReturn("approved")
                    .build();

            Preference preference = preferenceClient.create(request);
            return preference.getSandboxInitPoint();

        } catch (MPException | MPApiException e) {
            throw new PaymentProcessingException("Error al crear checkout de Mercado Pago", e);
        }
    }

    /**
     * Webhook para actualizar estado de pago
     */
    public void handleWebhook(String rawBody, Long adminId) {
        try {
            var mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            var payload = mapper.readValue(rawBody, java.util.Map.class);

            var data = (java.util.Map<String, Object>) payload.get("data");
            if (data == null) return;

            String paymentIdStr = String.valueOf(data.get("id"));
            Long mpPaymentId = Long.parseLong(paymentIdStr);

            // ⚡ Tomar token del admin
            Admin admin = adminRepository.findById(adminId)
                    .orElseThrow(() -> new RuntimeException("Admin no encontrado"));
            String token = admin.getMpTokenSandbox();
            MercadoPagoConfig.setAccessToken(token);

            var mpPayment = new com.mercadopago.client.payment.PaymentClient().get(mpPaymentId);
            Long localPaymentId = Long.valueOf(mpPayment.getExternalReference());

            Payment payment = paymentRepository.findById(localPaymentId)
                    .orElseThrow(() -> new RuntimeException("Pago no encontrado"));

            switch (mpPayment.getStatus()) {
                case "approved" -> {
                    payment.setStatus(PaymentStatus.PAID);
                    payment.setPaymentDate(LocalDate.now());
                }
                case "pending" -> payment.setStatus(PaymentStatus.PENDING);
                case "rejected", "cancelled" -> payment.setStatus(PaymentStatus.CANCELLED);
            }

            paymentRepository.save(payment);
            log.info("Pago {} actualizado según webhook Sandbox", localPaymentId);

        } catch (Exception e) {
            log.error("Error procesando webhook Sandbox", e);
        }
    }

}
