package com.ediflow.backend.service.impl;

import com.ediflow.backend.dto.apartment.ApartmentDTO;
import com.ediflow.backend.dto.apartment.ApartmentSummaryDTO;
import com.ediflow.backend.dto.building.BuildingDTO;
import com.ediflow.backend.dto.admin.AdminDTO;
import com.ediflow.backend.dto.building.BuildingDetailDTO;
import com.ediflow.backend.dto.building.BuildingSummaryDTO;
import com.ediflow.backend.dto.resident.ResidentSummaryDTO;
import com.ediflow.backend.dto.user.UserDTO;
import com.ediflow.backend.dto.user.UserSummaryDTO;
import com.ediflow.backend.entity.*;
import com.ediflow.backend.repository.*;
import com.ediflow.backend.service.IApartmentService;
import com.ediflow.backend.service.IBuildingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BuildingServiceimpl implements IBuildingService {

    private final IResidentRepository residentRepository;
    private final IUserRepository userRepository;
    private final IBuildingRepository buildingRepository;
    private final IApartmentRepository apartmentRepository;
    private final IAdminRepository adminRepository;


    public BuildingServiceimpl(IResidentRepository residentRepository, IUserRepository userRepository, IBuildingRepository buildingRepository, IApartmentRepository apartmentRepository, IAdminRepository adminRepository) {
        this.residentRepository = residentRepository;
        this.userRepository = userRepository;
        this.buildingRepository = buildingRepository;
        this.apartmentRepository = apartmentRepository;
        this.adminRepository = adminRepository;
    }

    @Override
    public ResponseEntity<String> createBuilding(BuildingDTO newBuilding) {
        if (newBuilding.getAdminDTO() == null){
            return new ResponseEntity<>("Falta edificio",HttpStatus.BAD_REQUEST);
        }
        Optional<Admin> adminOpt = adminRepository.findById(newBuilding.getAdminDTO().getId());
        if (!adminOpt.isPresent()) {
            return new ResponseEntity<>("Admin no encontrado", HttpStatus.NOT_FOUND);
        }
        Admin admin = adminOpt.get();

        try {
            Building building = new Building();
            building.setName(newBuilding.getName());
            building.setAddress(newBuilding.getAddress());
            building.setAdmin(admin);

            admin.getBuildings().add(building);

            buildingRepository.save(building);
            return new ResponseEntity<>("Edificio creado con éxito", HttpStatus.CREATED);
        } catch (Exception e){
            return new ResponseEntity<>("Error al crear el edificio: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<BuildingDetailDTO> buildingDetail(Long id) {
        Optional<Building> buildingOpt = buildingRepository.findById(id);

        if (buildingOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Building building = buildingOpt.get();

        // Convertir lista de Apartment a ApartmentDTO
        List<ApartmentSummaryDTO> apartmentSummaries = building.getApartments().stream().map(apartment ->
                new ApartmentSummaryDTO(
                        apartment.getId(),
                        apartment.getFloor(),
                        apartment.getNumber()
                )
        ).toList();

        BuildingDetailDTO dto = new BuildingDetailDTO(
                building.getId(),
                building.getName(),
                building.getAddress(),
                apartmentSummaries
        );

        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ResidentSummaryDTO> residentSummary(Long id) {
        Optional<Resident> residentOpt = residentRepository.findById(id);

        if (residentOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Resident resident = residentOpt.get();

        // Obtener usuario
        User user = resident.getUser();
        UserSummaryDTO userSummaryDTO = new UserSummaryDTO(
                user.getUsername(),
                user.getEmail()
        );

        // Obtener número de apartamento (si existe)
        int apartmentNumber = resident.getApartment() != null ? resident.getApartment().getNumber() : 0;

        // Crear el DTO
        ResidentSummaryDTO dto = new ResidentSummaryDTO(
                resident.getId(),
                resident.getCi(),
                userSummaryDTO,
                apartmentNumber
        );

        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    public List<BuildingSummaryDTO> findAllForAdminPanel(Long id) {
        return buildingRepository.findByAdminId(id)
                .stream()
                .map(building -> new BuildingSummaryDTO(
                        building.getId(),
                        building.getName(),
                        building.getAddress()
                ))
                .collect(Collectors.toList());
    }


    @Override
    public ResponseEntity<String> updateBuilding(Long id, BuildingDTO buildingDTO) {
        if (buildingDTO == null) {
            return new ResponseEntity<>("Falta información del edificio", HttpStatus.BAD_REQUEST);
        }

        Optional<Building> optionalBuilding = buildingRepository.findById(id);

        if (optionalBuilding.isEmpty()) {
            return new ResponseEntity<>("El edificio con id: " + id + " no existe", HttpStatus.BAD_REQUEST);
        }

        Building updateBuilding = optionalBuilding.get();

        if (buildingDTO.getName() != null) {
            updateBuilding.setName(buildingDTO.getName());
        }

        if (buildingDTO.getAddress() != null) {
            updateBuilding.setAddress(buildingDTO.getAddress());
        }

        try {
            buildingRepository.save(updateBuilding);
            return new ResponseEntity<>("El edificio se actualizó correctamente", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al actualizar el edificio: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> deleteBuilding(Long id) {
        boolean buildingExist = buildingRepository.findById(id).isPresent();
        if (buildingExist){
            buildingRepository.deleteById(id);
            return new ResponseEntity<>("Edificio eliminado correctamente",HttpStatus.OK);
        } else {

            return new ResponseEntity<>("Edificio no encontrado",HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public List<BuildingDTO> findAllForAdminPanel() {
        List<Building> buildings = buildingRepository.findAll();
        List<BuildingDTO> buildingDTOS = new ArrayList<>();

        for (Building building : buildings) {
            AdminDTO adminDTO = null;
            if (building.getAdmin() != null && building.getAdmin().getUser() != null) {
                UserDTO userDTO = new UserDTO(
                        building.getAdmin().getUser().getId(),
                        building.getAdmin().getUser().getUsername(),
                        building.getAdmin().getUser().getEmail(),
                        building.getAdmin().getUser().getRole()
                );

                // Create a list of BuildingDTOs for the admin's buildings (without adminDTO to avoid circular reference)
                List<BuildingSummaryDTO> adminBuildingSummaries = new ArrayList<>();
                if (building.getAdmin().getBuildings() != null) {
                    for (Building adminBuilding : building.getAdmin().getBuildings()) {
                        BuildingSummaryDTO summary = new BuildingSummaryDTO(
                                adminBuilding.getId(),
                                adminBuilding.getName(),
                                adminBuilding.getAddress()
                        );
                        adminBuildingSummaries.add(summary);
                    }
                }

                System.out.println("Building admin: " + building.getAdmin());
                if (building.getAdmin() != null) {
                    System.out.println("Admin ID: " + building.getAdmin().getId());
                    System.out.println("Admin User: " + building.getAdmin().getUser());
                    if (building.getAdmin().getUser() != null) {
                        System.out.println("User ID: " + building.getAdmin().getUser().getId());
                        System.out.println("User email: " + building.getAdmin().getUser().getEmail());
                    }
                }

                adminDTO = new AdminDTO(
                        building.getAdmin().getId(),
                        userDTO,
                        adminBuildingSummaries
                );
            } else {
                System.out.println("Admin o User es null para el edificio ID: " + building.getId());
            }

            BuildingDTO dto = new BuildingDTO();
            dto.setId(building.getId());
            dto.setName(building.getName());
            dto.setAddress(building.getAddress());
            dto.setAdminDTO(adminDTO);
            dto.setResidentCount(0);

            buildingDTOS.add(dto);
        }
        return buildingDTOS;
    }

    @Override
    public List<BuildingSummaryDTO> findAllBuildings() {
        List<Building> buildings = buildingRepository.findAll();
        List<BuildingSummaryDTO> result = new ArrayList<>();

        for (Building building : buildings) {
            BuildingSummaryDTO dto = new BuildingSummaryDTO(
                    building.getId(),
                    building.getName(),
                    building.getAddress()
            );
            result.add(dto);
        }

        return result;
    }


}
