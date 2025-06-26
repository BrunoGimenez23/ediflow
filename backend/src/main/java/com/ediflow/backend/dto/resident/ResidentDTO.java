package com.ediflow.backend.dto.resident;

import com.ediflow.backend.dto.apartment.ApartmentDTO;
import com.ediflow.backend.dto.building.BuildingDTO;
import com.ediflow.backend.dto.payment.PaymentDTO;
import com.ediflow.backend.dto.user.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResidentDTO {

    private Long id;
    private Long ci;

    private UserDTO userDTO;
    private Long buildingId;
    private Long apartmentId;
    private ApartmentDTO apartmentDTO;
    private BuildingDTO buildingDTO;
    private List<PaymentDTO> payment;


}
