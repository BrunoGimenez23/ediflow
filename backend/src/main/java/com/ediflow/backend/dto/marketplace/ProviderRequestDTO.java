package com.ediflow.backend.dto.marketplace;

import lombok.Data;

@Data
public class ProviderRequestDTO {
    private String name;
    private String email;
    private String phone;
    private String category;
    private String location;
}
