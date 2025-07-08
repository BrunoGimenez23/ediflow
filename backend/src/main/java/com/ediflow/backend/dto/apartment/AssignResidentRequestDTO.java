package com.ediflow.backend.dto.apartment;

import lombok.Data;

@Data
public class AssignResidentRequestDTO {
    private Long apartmentId;
    private Long userId;
}