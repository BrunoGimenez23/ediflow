package com.ediflow.backend.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WhatsAppService {

    private final String PHONE_NUMBER_ID = "843616918826271"; // tu identificador del número
    private final String ACCESS_TOKEN = "EAAbjl17ZBIKsBPSWjIlPqiRE4GTKZAvtC8SSkGgMRFMCGst1RCIxOkrdyS0ts1Rw5ETHthviYODlwm34ntHmoOA2VjTf1HUDh9OqliNUsZAcv0bhyewUqirbo1DfNkMSfRUmpBTOSMHP0VVwrPntaZAp1c2M0rgg185YjHAGx8n4amenLztrCQZCoVuZBDZCjR7L2hGFkyZC6PkKnwgc1Jw4jyeqj2CoSuhpgULR6OtHhKJ5QgZDZD";   // tu token de WhatsApp Cloud API
    private final String API_URL = "https://graph.facebook.com/v18.0/";

    public void sendMessage(String toPhone, String message) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(ACCESS_TOKEN);

        String body = """
        {
          "messaging_product": "whatsapp",
          "to": "%s",
          "type": "text",
          "text": { "body": "%s" }
        }
        """.formatted(toPhone, message);

        HttpEntity<String> request = new HttpEntity<>(body, headers);

        try {
            restTemplate.postForEntity(
                    API_URL + PHONE_NUMBER_ID + "/messages",
                    request,
                    String.class
            );
        } catch (Exception e) {
            System.err.println("❌ Error enviando WhatsApp: " + e.getMessage());
        }
    }
}
