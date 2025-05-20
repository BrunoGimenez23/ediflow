package com.ediflow.backend.dto.resident;

import com.ediflow.backend.dto.apartment.ApartmentDTO;
import com.ediflow.backend.dto.building.BuildingDTO;
import com.ediflow.backend.dto.user.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResidentDTO {

    private Long id;
    private Long ci;
    private UserDTO userDTO;
    private BuildingDTO buildingDTO;
    private ApartmentDTO apartmentDTO;
//    private boolean hasPendingPayments;
}
