package com.ediflow.backend.dto.marketplace;

import lombok.Data;

@Data
public class ReviewRequestDTO {
    private Long providerId;
    private Long orderId;
    private Integer rating; // 1-5
    private String comment;
}
