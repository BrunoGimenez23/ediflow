package com.ediflow.backend.dto.marketplace;

import lombok.Data;

@Data
public class ReviewResponseDTO {
    private Long id;
    private Long providerId;
    private Integer rating;
    private String comment;
}
