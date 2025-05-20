package com.ediflow.backend.dto.apartment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApartmentSummaryDTO {
    private Long id;
    private int floor;
    private int number;
}
