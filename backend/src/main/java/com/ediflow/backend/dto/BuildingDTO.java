package com.ediflow.backend.dto;



import com.ediflow.backend.dto.admin.AdminDTO;
import jakarta.validation.constraints.NotNull;
import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class BuildingDTO {

    @NotNull(message = "El ID del edificio es obligatorio")
    private Long id;

    private String name;

    private String address;

    private AdminDTO adminDTO;

    private int residentCount;

    public BuildingDTO(Long id, String name, String address) {
        this.id = id;
        this.name = name;
        this.address = address;
    }
}
