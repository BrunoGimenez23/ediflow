package com.ediflow.backend.dto.commonarea;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommonAreaDTO {
    private Long id;
    private String name;
    private String description;
    private Long buildingId;
    private Integer capacity;

}
