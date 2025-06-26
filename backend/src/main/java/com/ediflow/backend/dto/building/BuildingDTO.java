package com.ediflow.backend.dto.building;



import com.ediflow.backend.dto.admin.AdminDTO;
import com.ediflow.backend.entity.Building;
import jakarta.validation.constraints.NotNull;
import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuildingDTO {
    Long id;

    private String name;

    private String address;
    private Long adminId;

    private int residentCount;

}
