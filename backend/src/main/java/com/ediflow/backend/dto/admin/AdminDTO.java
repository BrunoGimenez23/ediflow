package com.ediflow.backend.dto.admin;

import com.ediflow.backend.dto.BuildingDTO;
import com.ediflow.backend.dto.user.UserDTO;
import lombok.*;

import java.util.List;


@NoArgsConstructor
@AllArgsConstructor
@Data
public class AdminDTO {
    private Long id;

    private UserDTO userDTO;

    private List<BuildingDTO> buildings;

}
