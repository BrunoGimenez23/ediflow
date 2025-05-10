package com.ediflow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApartmentDTO {
    private Long id;
    private Integer floor;
    private Integer number;

}
