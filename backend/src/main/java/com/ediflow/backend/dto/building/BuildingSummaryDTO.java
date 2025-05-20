package com.ediflow.backend.dto.building;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BuildingSummaryDTO {
    private Long id;
    private String name;
    private String address;
}
