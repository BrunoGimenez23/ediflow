package com.ediflow.backend.dto;

import com.ediflow.backend.dto.user.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResidentDTO {


    private Long ci;
    private UserDTO userDTO;
    private BuildingDTO buildingDTO;
    private ApartmentDTO apartmentDTO;
//    private boolean hasPendingPayments;
}
