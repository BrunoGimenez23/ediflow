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
    public ResponseEntity<BuildingDTO> createBuilding(BuildingDTO newBuilding, Long adminAccountId) {
        if (adminAccountId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        Optional<Admin> adminOpt = adminRepository.findByUser_AdminAccount_Id(adminAccountId);
        if (adminOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Admin admin = adminOpt.get();

        try {
            Building building = new Building();
            building.setName(newBuilding.getName());
            building.setAddress(newBuilding.getAddress());
            building.setAdmin(admin);

            building = buildingRepository.save(building);

            BuildingDTO dto = new BuildingDTO();
            dto.setId(building.getId());
            dto.setName(building.getName());
            dto.setAddress(building.getAddress());
            dto.setAdminId(admin.getUser().getAdminAccount().getId());

            return new ResponseEntity<>(dto, HttpStatus.CREATED);

        } catch (Exception e) {
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


        User user = resident.getUser();
        UserSummaryDTO userSummaryDTO = new UserSummaryDTO(
                user.getUsername(),
                user.getEmail()
        );


        int apartmentNumber = resident.getApartment() != null ? resident.getApartment().getNumber() : 0;


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


    private Long getLoggedAdminAccountId() {
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

        User user = userOpt.get();
        if (user.getAdminAccount() == null) {
            return null;
        }

        return user.getAdminAccount().getId();
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

    @Override
    public List<BuildingDTO> findAllByAdminAccount(Long adminAccountId) {
        List<Building> buildings = buildingRepository.findByAdmin_User_AdminAccount_Id(adminAccountId);
        return buildings.stream()
                .map(b -> new BuildingDTO(
                        b.getId(),
                        b.getName(),
                        b.getAddress(),
                        b.getAdmin() != null ? b.getAdmin().getId() : null,
                        (int) b.getApartments().stream()
                                .filter(apartment -> apartment.getResident() != null)
                                .count()
                ))
                .collect(Collectors.toList());

    }
    public List<BuildingDTO> findBuildingsByAdminAccountId(Long adminAccountId) {
        List<Building> buildings = buildingRepository.findBuildingsByAdminAccountId(adminAccountId);
        return buildings.stream().map(b -> {
            BuildingDTO dto = new BuildingDTO();
            dto.setId(b.getId());
            dto.setName(b.getName());
            dto.setAddress(b.getAddress());
            dto.setAdminId(b.getAdmin() != null ? b.getAdmin().getId() : null);


            long residentCount = b.getApartments().stream()
                    .filter(apartment -> apartment.getResident() != null)
                    .count();

            dto.setResidentCount((int) residentCount);

            return dto;
        }).toList();
    }



    public Long getAdminAccountIdByUserEmail(String email) {
        return userRepository.findByEmail(email)
                .map(u -> u.getAdminAccount() != null ? u.getAdminAccount().getId() : null)
                .orElse(null);
    }


}
