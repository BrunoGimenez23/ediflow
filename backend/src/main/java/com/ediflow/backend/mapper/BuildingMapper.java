package com.ediflow.backend.mapper;

import com.ediflow.backend.dto.building.BuildingDTO;
import com.ediflow.backend.entity.Building;
import org.springframework.stereotype.Component;

@Component
public class BuildingMapper {

    public BuildingDTO toDTO(Building building) {
        if (building == null) return null;

        BuildingDTO dto = new BuildingDTO();
        dto.setId(building.getId());
        dto.setName(building.getName());
        dto.setAddress(building.getAddress());

        if (building.getAdmin() != null) {
            dto.setAdminId(building.getAdmin().getId());
        }


        int totalResidents = 0;
        if (building.getApartments() != null) {
            totalResidents = (int) building.getApartments().stream()
                    .filter(apartment -> apartment.getResident() != null)
                    .count();
        }
        dto.setResidentCount(totalResidents);

        return dto;
    }

    public Building toEntity(BuildingDTO dto) {
        if (dto == null) return null;

        Building building = new Building();
        building.setId(dto.getId());
        building.setName(dto.getName());
        building.setAddress(dto.getAddress());


        return building;
    }
}
