package com.ediflow.backend.service.impl;

import com.ediflow.backend.dto.BuildingDTO;
import com.ediflow.backend.dto.admin.AdminDTO;
import com.ediflow.backend.dto.user.UserDTO;
import com.ediflow.backend.entity.Admin;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.repository.IApartmentRepository;
import com.ediflow.backend.repository.IResidentRepository;
import com.ediflow.backend.repository.IUserRepository;
import com.ediflow.backend.service.IBuildingService;
import com.ediflow.backend.entity.Building;
import org.springframework.beans.factory.annotation.Autowired;
import com.ediflow.backend.repository.IBuildingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
@Service
public class BuildingServiceimpl implements IBuildingService {

    private final IResidentRepository residentRepository;
    private final IUserRepository userRepository;
    private final IBuildingRepository buildingRepository;
    private final IApartmentRepository apartmentRepository;


    public BuildingServiceimpl(IResidentRepository residentRepository, IUserRepository userRepository, IBuildingRepository buildingRepository, IApartmentRepository apartmentRepository) {
        this.residentRepository = residentRepository;
        this.userRepository = userRepository;
        this.buildingRepository = buildingRepository;
        this.apartmentRepository = apartmentRepository;
    }

    @Override
    public String createBuilding(Building newBuilding) {
        buildingRepository.save(newBuilding);
        return "Edificio creado";
    }

    @Override
    public Optional<Building> findById(Long id) {
        return buildingRepository.findById(id);
    }



    @Override
    public ResponseEntity<String> updateBuilding(Long id, BuildingDTO buildingDTO) {
        boolean buildingExist = buildingRepository.existsById(id);
        if (!buildingExist) {
            return new ResponseEntity<>("El edificio con id: " + id + "no existe", HttpStatus.BAD_REQUEST);
        }

        Building updateBuilding = buildingRepository.findById(id).orElse(null);
        if (updateBuilding == null) {
            return new ResponseEntity<>("No puede ser nulo", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (buildingDTO == null){
            return new ResponseEntity<>("Falta información del edificio", HttpStatus.BAD_REQUEST);
        }

        if (buildingDTO.getName() != null){
            updateBuilding.setName(buildingDTO.getName());
        }
        if (buildingDTO.getAddress() != null){
            updateBuilding.setAddress(buildingDTO.getAddress());
        }

        try{
            buildingRepository.save(updateBuilding);
        } catch (Exception e){
            return new ResponseEntity<>("Error al actualizar el edificio: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>("El edificio se actualizó correctamente", HttpStatus.OK);
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
    public List<BuildingDTO> findAll() {
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
                List<BuildingDTO> adminBuildings = new ArrayList<>();
                if (building.getAdmin().getBuildings() != null) {
                    for (Building adminBuilding : building.getAdmin().getBuildings()) {
                        BuildingDTO adminBuildingDTO = new BuildingDTO(
                                adminBuilding.getId(),
                                adminBuilding.getName(),
                                adminBuilding.getAddress(),
                                null, // Set adminDTO to null to avoid circular reference
                                0 // residentCount
                        );
                        adminBuildings.add(adminBuildingDTO);
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
                        adminBuildings
                );
            } else {
                System.out.println("Admin o User es null para el edificio ID: " + building.getId());
            }

            BuildingDTO dto = new BuildingDTO(
                    building.getId(),
                    building.getName(),
                    building.getAddress(),
                    adminDTO,
                    0 // Temporal hasta implementar Resident
            );
            buildingDTOS.add(dto);
        }
        return buildingDTOS;
    }
}
