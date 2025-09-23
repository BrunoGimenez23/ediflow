package com.ediflow.backend.dto.marketplace;

import lombok.Data;

@Data
public class QuoteResponseDTO {
    private Long id;
    private Long orderId;
    private Double amount;
    private String message;
    private String status;
    private String orderDescription;
    private String providerName;
    private String errorMessage;
    private String buildingName;


    public QuoteResponseDTO() {
    }


    public QuoteResponseDTO(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public QuoteResponseDTO(Long id, Long orderId, Double amount, String message, String status, String orderDescription, String providerName) {
        this.id = id;
        this.orderId = orderId;
        this.amount = amount;
        this.message = message;
        this.status = status;
        this.orderDescription = orderDescription;
        this.providerName = providerName;
        this.buildingName = buildingName;
    }
}