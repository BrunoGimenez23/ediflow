package com.ediflow.backend.service;

import com.ediflow.backend.dto.BuildingDTO;
import com.ediflow.backend.entity.Building;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface IBuildingService {

    String createBuilding (Building newBuilding);
    Optional<Building> findById (Long id);
    void update (Building building);
    ResponseEntity<String> deleteBuilding (Long id);

    List<BuildingDTO> findAll();
}
