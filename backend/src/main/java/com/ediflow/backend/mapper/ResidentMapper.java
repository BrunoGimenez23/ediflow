package com.ediflow.backend.mapper;

import com.ediflow.backend.dto.resident.ResidentDTO;
import com.ediflow.backend.entity.Resident;
import org.springframework.stereotype.Component;

@Component
public class ResidentMapper {

    private final BuildingMapper buildingMapper;
    private final ApartmentMapper apartmentMapper;
    private final UserMapper userMapper;

    public ResidentMapper(BuildingMapper buildingMapper, ApartmentMapper apartmentMapper, UserMapper userMapper) {
        this.buildingMapper = buildingMapper;
        this.apartmentMapper = apartmentMapper;
        this.userMapper = userMapper;
    }

    public ResidentDTO toDTO(Resident resident) {
        if (resident == null) return null;

        ResidentDTO dto = new ResidentDTO();
        dto.setId(resident.getId());
        dto.setCi(resident.getCi());

        if (resident.getUser() != null) {
            dto.setUserDTO(userMapper.toUserDTO(resident.getUser(), null)); // suponiendo que este método existe
        }

        if (resident.getBuilding() != null) {
            dto.setBuildingId(resident.getBuilding().getId());
            dto.setBuildingDTO(buildingMapper.toDTO(resident.getBuilding()));  // <-- Aquí seteamos buildingDTO
        }

        if (resident.getApartment() != null) {
            dto.setApartmentId(resident.getApartment().getId());
            dto.setApartmentDTO(apartmentMapper.toDTO(resident.getApartment()));  // <-- Aquí seteamos apartmentDTO
        }

        return dto;
    }
}

