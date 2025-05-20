package com.ediflow.backend.dto.apartment;

import com.ediflow.backend.dto.building.BuildingDTO;
import com.ediflow.backend.dto.resident.ResidentDTO;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApartmentDTO {

    private Long id;

    @NotNull(message = "El piso es obligatorio")
    private Integer floor;

    @NotNull(message = "El número es obligatorio")
    private Integer number;

    @NotNull(message = "El edificio es obligatorio")
    private BuildingDTO buildingDTO;

    private ResidentDTO residentDTO;
}
