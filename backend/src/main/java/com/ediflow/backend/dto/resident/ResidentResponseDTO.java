package com.ediflow.backend.dto.resident;

import lombok.Data;

@Data
public class ResidentResponseDTO {
    private Long id;
    private String fullName;
    private String email;
    private Long apartmentId;
    private Long ci;
}
