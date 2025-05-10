package com.ediflow.backend.dto.admin;

import com.ediflow.backend.dto.BuildingDTO;
import com.ediflow.backend.dto.user.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


@NoArgsConstructor
@Getter
@Setter
public class AdminDTO {
    private Long id;

    private UserDTO userDTO;

    private List<BuildingDTO> buildings;

    public AdminDTO(Long id, UserDTO userDTO) {
    }

    public AdminDTO(Long id, UserDTO userDTO, List<BuildingDTO> adminBuildings) {
    }
}
