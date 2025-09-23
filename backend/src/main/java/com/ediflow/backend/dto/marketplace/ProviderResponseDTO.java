package com.ediflow.backend.dto.marketplace;

import lombok.Data;

@Data
public class ProviderResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String category;
    private String location;
    private Double rating;
    private Integer totalReviews;
    private String userEmail;
}
