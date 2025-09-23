package com.ediflow.backend.dto.marketplace;

import lombok.Data;

@Data
public class RequestQuoteDTO {
    private Long providerId;
    private Long buildingId;
    private String category;
    private String message;
    private String orderDescription;
    private Long orderId;
}
