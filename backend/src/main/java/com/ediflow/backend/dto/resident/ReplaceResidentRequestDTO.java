package com.ediflow.backend.dto.resident;

import lombok.Data;

@Data
public class ReplaceResidentRequestDTO {
    private Long apartmentId;
    private Long userId;
}
