package com.ediflow.backend.dto.building;

import com.ediflow.backend.dto.apartment.ApartmentDTO;
import com.ediflow.backend.dto.apartment.ApartmentSummaryDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BuildingDetailDTO {
    private Long buildingId;

    private String name;

    private String address;

    private List<ApartmentSummaryDTO> apartments;
}
