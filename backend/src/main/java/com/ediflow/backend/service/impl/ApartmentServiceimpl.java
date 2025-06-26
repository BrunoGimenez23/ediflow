package com.ediflow.backend.service.impl;

import com.ediflow.backend.dto.apartment.ApartmentDTO;
import com.ediflow.backend.dto.apartment.ApartmentSummaryDTO;
import com.ediflow.backend.dto.building.BuildingDTO;
import com.ediflow.backend.dto.resident.ResidentDTO;
import com.ediflow.backend.dto.user.UserDTO;
import com.ediflow.backend.entity.Building;
import com.ediflow.backend.entity.Resident;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.repository.IBuildingRepository;
import com.ediflow.backend.repository.IResidentRepository;
import com.ediflow.backend.service.IApartmentService;
import com.ediflow.backend.entity.Apartment;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import com.ediflow.backend.repository.IApartmentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
@Service
public class ApartmentServiceimpl implements IApartmentService {

    private IApartmentRepository apartmentRepository;

    private IBuildingRepository buildingRepository;

    private final AdminServiceimpl adminService;
    private final IResidentRepository residentRepository;


    @Autowired
    public ApartmentServiceimpl(IApartmentRepository apartmentRepository, IBuildingRepository buildingRepository, AdminServiceimpl adminService, IResidentRepository residentRepository) {
        this.apartmentRepository = apartmentRepository;
        this.buildingRepository = buildingRepository;
        this.adminService = adminService;
        this.residentRepository = residentRepository;
    }
    @Override
    public ApartmentDTO findByResidentEmail(String email) {
        Resident resident = residentRepository.findByUserEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Residente no encontrado para email: " + email));
        if (resident == null) return null;

        List<Apartment> apartments = apartmentRepository.findByResident(resident);
        Apartment apartment = apartments.isEmpty() ? null : apartments.get(0);

        if (apartment == null) return null;

        // Conversión manual
        ApartmentDTO dto = new ApartmentDTO();
        dto.setId(apartment.getId());
        dto.setNumber(apartment.getNumber());
        dto.setFloor(apartment.getFloor());

        if (apartment.getBuilding() != null) {
            BuildingDTO buildingDTO = new BuildingDTO();
            buildingDTO.setId(apartment.getBuilding().getId());
            buildingDTO.setName(apartment.getBuilding().getName());
            buildingDTO.setAddress(apartment.getBuilding().getAddress());
            dto.setBuildingDTO(buildingDTO);
        }

        return dto;
    }


    @Override
    @Transactional
    public ResponseEntity<Map<String, String>> createApartment(ApartmentDTO newApartment) {
        if (newApartment.getBuildingId() == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Falta ID del edificio"));
        }

        Optional<Building> buildingOpt = buildingRepository.findById(newApartment.getBuildingId());
        if (buildingOpt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Edificio no encontrado"));
        }

        Building building = buildingOpt.get();

        Apartment apartment = new Apartment();
        apartment.setNumber(newApartment.getNumber());
        apartment.setFloor(newApartment.getFloor());
        apartment.setBuilding(building);

        apartmentRepository.save(apartment);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("message", "Apartamento creado con éxito"));
    }


    @Override
    public Optional<Apartment> findById(Long id) {
        return apartmentRepository.findById(id);
    }

    @Override
    public ResponseEntity<Map<String, String>> updateApartment(Long id, ApartmentDTO apartmentDTO) {
        if (apartmentDTO == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Datos del apartamento requeridos"));
        }

        Optional<Apartment> optionalApartment = apartmentRepository.findById(id);

        if (optionalApartment.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Apartamento no encontrado"));
        }

        Apartment apartment = optionalApartment.get();

        if (apartmentDTO.getNumber() != null) {
            apartment.setNumber(apartmentDTO.getNumber());
        }

        if (apartmentDTO.getFloor() != null) {
            apartment.setFloor(apartmentDTO.getFloor());
        }

        try {
            apartmentRepository.save(apartment);
            return ResponseEntity
                    .ok(Map.of("message", "Apartamento actualizado correctamente"));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al actualizar el apartamento: " + e.getMessage()));
        }
    }

    @Override
    public ResponseEntity<Map<String, String>> deleteApartment(Long id) {
        if (!apartmentRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Apartamento no encontrado"));
        }
        apartmentRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Apartamento eliminado correctamente"));
    }

    @Override
    public List<ApartmentDTO> findAll() {
        Long adminId = adminService.getLoggedAdminId();
        System.out.println(">>> ADMIN ID desde token: " + adminId);

        if (adminId == null) {
            System.out.println(">>> Admin ID es null, devolviendo lista vacía");
            return new ArrayList<>();
        }

        List<Apartment> apartments = apartmentRepository.findByBuilding_Admin_Id(adminId);
        System.out.println(">>> Apartamentos encontrados: " + apartments.size());

        List<ApartmentDTO> apartmentsDTO = new ArrayList<>();

        for (Apartment apartment : apartments) {
            System.out.println(">>> Apartment ID: " + apartment.getId());
            ApartmentDTO apartmentDTO = new ApartmentDTO();
            apartmentDTO.setId(apartment.getId());
            apartmentDTO.setNumber(apartment.getNumber());
            apartmentDTO.setFloor(apartment.getFloor());

            // Setear BuildingDTO completo para que React pueda mostrar el nombre del edificio
            if (apartment.getBuilding() != null) {
                Building building = apartment.getBuilding();
                BuildingDTO buildingDTO = new BuildingDTO();
                buildingDTO.setId(building.getId());
                buildingDTO.setName(building.getName());
                buildingDTO.setAddress(building.getAddress()); // si lo necesitás

                apartmentDTO.setBuildingDTO(buildingDTO);
                apartmentDTO.setBuildingId(building.getId());
            }

            // Mapear ResidentDTO igual que venías haciendo
            if (apartment.getResident() != null) {
                Resident resident = apartment.getResident();
                ResidentDTO residentDTO = new ResidentDTO();
                residentDTO.setId(resident.getId());
                residentDTO.setCi(resident.getCi());

                // UserDTO del residente
                User user = resident.getUser();
                if (user != null) {
                    UserDTO userDTO = new UserDTO();
                    userDTO.setId(user.getId());
                    userDTO.setUsername(user.getUsername());
                    userDTO.setEmail(user.getEmail());
                    userDTO.setRole(user.getRole());
                    userDTO.setFullName(user.getFullName());
                    residentDTO.setUserDTO(userDTO);
                }
                apartmentDTO.setResidentDTO(residentDTO);
            }

            apartmentsDTO.add(apartmentDTO);
        }

        return apartmentsDTO;
    }



    @Override
    public List<ApartmentSummaryDTO> findByBuildingId(Long id) {
       List<Apartment> apartments = apartmentRepository.findByBuildingId(id);
       List<ApartmentSummaryDTO> apartamentsDTO = new ArrayList<>();

       for (Apartment apartment : apartments){
           ApartmentSummaryDTO dto = new ApartmentSummaryDTO();

           dto.setId(apartment.getId());
           dto.setNumber(apartment.getNumber());
           dto.setFloor(apartment.getFloor());

           apartamentsDTO.add(dto);
       }
       return apartamentsDTO;
    }
}
