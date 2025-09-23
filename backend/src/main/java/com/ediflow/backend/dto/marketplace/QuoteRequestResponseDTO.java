package com.ediflow.backend.dto.marketplace;

import lombok.Data;

@Data
public class QuoteRequestResponseDTO {
    private Long id;
    private Long orderId;
    private String message;
    private Long providerId;
    private String status;
    private String createdAt;
}
