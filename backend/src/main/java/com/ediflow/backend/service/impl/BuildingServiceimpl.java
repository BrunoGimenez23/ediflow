package com.ediflow.backend.service.impl;

import com.ediflow.backend.dto.BuildingDTO;
import com.ediflow.backend.dto.admin.AdminDTO;
import com.ediflow.backend.dto.user.UserDTO;
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

    private IBuildingRepository buildingRepository;
    @Autowired
    public BuildingServiceimpl(IBuildingRepository buildingRepository) {
        this.buildingRepository = buildingRepository;
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
    public void update(Building building) {
        buildingRepository.save(building);
    }

    @Override
    public ResponseEntity<String> deleteBuilding(Long id) {
        buildingRepository.deleteById(id);
        return new ResponseEntity<>("Usuario eliminado correctamente", HttpStatus.OK);
    }

    @Override
    public List<BuildingDTO> findAll() {

        List<Building> buildings = buildingRepository.findAll();

        List<BuildingDTO> buildingDTOS = new ArrayList<>();

        for (Building building : buildings) {
            buildingDTOS.add(new BuildingDTO(building.getId(),building.getName(),
                    building.getAddress(),
            new AdminDTO(building.getAdmin().getId(),
                    new UserDTO(
                    building.getAdmin().getUser().getId(),
                    building.getAdmin().getUser().getUsername(),
                    building.getAdmin().getUser().getEmail()
            ))
            ));
        }

            return buildingDTOS;
    }
}
