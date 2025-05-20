package com.ediflow.backend.dto.building;



import com.ediflow.backend.dto.admin.AdminDTO;
import jakarta.validation.constraints.NotNull;
import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class BuildingDTO {
    Long id;

    private String name;

    private String address;

    private AdminDTO adminDTO;

    private int residentCount;

}
