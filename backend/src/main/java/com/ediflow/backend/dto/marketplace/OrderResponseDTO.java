package com.ediflow.backend.dto.marketplace;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class OrderResponseDTO {
    private Long id;
    private Long providerId;
    private String providerName;

    private Long buildingId;
    private String buildingName;

    private String category;
    private String description;
    private String status;
    private LocalDateTime createdAt;
    private Double totalAmount;
    private LocalDateTime preferredDate;
}
