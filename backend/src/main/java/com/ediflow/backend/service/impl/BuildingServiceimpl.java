package com.ediflow.backend.service.impl;

import com.ediflow.backend.configuration.JwtService;
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
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
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
    @Autowired
    private JwtService jwtService;

    @Autowired
    private HttpServletRequest request;


    public BuildingServiceimpl(IResidentRepository residentRepository, IUserRepository userRepository, IBuildingRepository buildingRepository, IApartmentRepository apartmentRepository, IAdminRepository adminRepository) {
        this.residentRepository = residentRepository;
        this.userRepository = userRepository;
        this.buildingRepository = buildingRepository;
        this.apartmentRepository = apartmentRepository;
        this.adminRepository = adminRepository;
    }

    @Override
    public ResponseEntity<BuildingDTO> createBuilding(BuildingDTO newBuilding) {
        if (newBuilding.getAdminId() == null){
            return ResponseEntity.badRequest().build();
        }

        Optional<Admin> adminOpt = adminRepository.findById(newBuilding.getAdminId());
        if (!adminOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Admin admin = adminOpt.get();

        try {
            Building building = new Building();
            building.setName(newBuilding.getName());
            building.setAddress(newBuilding.getAddress());
            building.setAdmin(admin);

            building = buildingRepository.save(building); // guardar y obtener el ID

            // Convertimos a DTO para devolverlo
            BuildingDTO dto = new BuildingDTO();
            dto.setId(building.getId());
            dto.setName(building.getName());
            dto.setAddress(building.getAddress());
            dto.setAdminId(admin.getId());

            return new ResponseEntity<>(dto, HttpStatus.CREATED);

        } catch (Exception e){
            return ResponseEntity.internalServerError().build();
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

    @Override
    public List<BuildingDTO> findAllForAdminPanel(Long adminId) {
        List<Building> buildings = buildingRepository.findByAdminId(adminId);

        return buildings.stream()
                .map(b -> new BuildingDTO(
                        b.getId(),
                        b.getName(),
                        b.getAddress(),
                        b.getAdmin().getId(),
                        (int) b.getApartments().stream()
                                .filter(apartment -> apartment.getResident() != null)
                                .count()
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
        Long adminId = getLoggedAdminId();
        if (adminId == null) {
            return new ArrayList<>();
        }

        List<Building> buildings = buildingRepository.findByAdminId(adminId);
        List<BuildingDTO> buildingDTOS = new ArrayList<>();

        for (Building building : buildings) {
            BuildingDTO dto = new BuildingDTO();
            dto.setId(building.getId());
            dto.setName(building.getName());
            dto.setAddress(building.getAddress());
            dto.setAdminId(building.getAdmin() != null ? building.getAdmin().getId() : null);
            // Contar residentes por apartamento que tienen residente
            int residentCount = (int) building.getApartments().stream()
                    .filter(apartment -> apartment.getResident() != null)
                    .count();
            dto.setResidentCount(residentCount);

            buildingDTOS.add(dto);
        }
        return buildingDTOS;
    }


    private Long getLoggedAdminId() {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        String jwt = authHeader.substring(7);
        String username = jwtService.extractUsername(jwt);
        if (username == null) {
            return null;
        }

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return null;
        }

        Optional<Admin> adminOpt = adminRepository.findByUserId(userOpt.get().getId());
        return adminOpt.map(Admin::getId).orElse(null);
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
