package com.ediflow.backend.mapper;

import com.ediflow.backend.dto.apartment.ApartmentDTO;
import com.ediflow.backend.dto.building.BuildingDTO;
import com.ediflow.backend.dto.payment.PaymentDTO;
import com.ediflow.backend.dto.resident.ResidentDTO;
import com.ediflow.backend.dto.user.UserDTO;
import com.ediflow.backend.entity.*;
import com.ediflow.backend.enums.PaymentStatus;
import com.ediflow.backend.mapper.ResidentMapper;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class PaymentMapper {

    private final ResidentMapper residentMapper;

    public PaymentMapper(ResidentMapper residentMapper) {
        this.residentMapper = residentMapper;
    }

    public PaymentDTO toDTO(Payment payment) {
        if (payment == null) return null;

        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setAmount(payment.getAmount());
        dto.setIssueDate(payment.getIssueDate());
        dto.setDueDate(payment.getDueDate());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setConcept(payment.getConcept());
        dto.setStatus(payment.getStatus());

        if (payment.getResident() != null) {
            Resident resident = payment.getResident();
            ResidentDTO residentDTO = new ResidentDTO();
            residentDTO.setId(resident.getId());
            residentDTO.setCi(resident.getCi());

            if (resident.getUser() != null) {
                User user = resident.getUser();
                UserDTO userDTO = UserDTO.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .fullName(user.getFullName())
                        .build();
                residentDTO.setUserDTO(userDTO);
            }

            if (resident.getApartment() != null) {
                Apartment apartment = resident.getApartment();
                ApartmentDTO apartmentDTO = new ApartmentDTO();
                apartmentDTO.setId(apartment.getId());
                apartmentDTO.setNumber(apartment.getNumber());
                apartmentDTO.setFloor(apartment.getFloor());

                if (apartment.getBuilding() != null) {
                    Building building = apartment.getBuilding();
                    BuildingDTO buildingDTO = new BuildingDTO();
                    buildingDTO.setId(building.getId());
                    buildingDTO.setName(building.getName());
                    buildingDTO.setAddress(building.getAddress());

                    apartmentDTO.setBuildingDTO(buildingDTO);
                }

                residentDTO.setApartmentDTO(apartmentDTO);
            }

            dto.setResidentDTO(residentDTO);
        }

        return dto;
    }
}
