package com.ediflow.backend.dto.marketplace;

import lombok.Data;

@Data
public class OrderRequestDTO {
    private Long providerId;
    private String description;
    private Long buildingId;
    private String category;
}
