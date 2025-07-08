
package com.ediflow.backend.mapper;

import com.ediflow.backend.dto.apartment.ApartmentDTO;
import com.ediflow.backend.dto.building.BuildingDTO;
import com.ediflow.backend.dto.resident.ResidentDTO;
import com.ediflow.backend.dto.user.UserDTO;
import com.ediflow.backend.entity.Apartment;
import com.ediflow.backend.entity.Building;
import com.ediflow.backend.entity.Resident;
import com.ediflow.backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class ApartmentMapper {

    public static ApartmentDTO toDTO(Apartment apartment) {
        if (apartment == null) return null;

        ApartmentDTO dto = new ApartmentDTO();
        dto.setId(apartment.getId());
        dto.setNumber(apartment.getNumber());
        dto.setFloor(apartment.getFloor());

        // Mapear buildingDTO
        Building building = apartment.getBuilding();
        if (building != null) {
            BuildingDTO buildingDTO = new BuildingDTO();
            buildingDTO.setId(building.getId());
            buildingDTO.setName(building.getName());
            buildingDTO.setAddress(building.getAddress());
            dto.setBuildingDTO(buildingDTO);
            dto.setBuildingId(building.getId());
        }

        // Mapear residentDTO
        Resident resident = apartment.getResident();
        if (resident != null) {
            ResidentDTO residentDTO = new ResidentDTO();
            residentDTO.setId(resident.getId());
            residentDTO.setCi(resident.getCi());

            User user = resident.getUser();
            if (user != null) {
                UserDTO userDTO = new UserDTO();
                userDTO.setId(user.getId());
                userDTO.setUsername(user.getUsername());
                userDTO.setEmail(user.getEmail());
                userDTO.setFullName(user.getFullName());
                userDTO.setRole(user.getRole());
                residentDTO.setUserDTO(userDTO);
            }

            dto.setResidentDTO(residentDTO);
        }

        return dto;
    }

    public static Apartment toEntity(ApartmentDTO dto) {
        if (dto == null) return null;

        Apartment apartment = new Apartment();
        apartment.setId(dto.getId());
        apartment.setNumber(dto.getNumber());
        apartment.setFloor(dto.getFloor());

        // No seteamos relaciones acá para evitar errores si faltan entidades anidadas
        return apartment;
    }
}
