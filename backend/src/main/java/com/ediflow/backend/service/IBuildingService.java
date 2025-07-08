package com.ediflow.backend.service;

import com.ediflow.backend.dto.building.BuildingDTO;
import com.ediflow.backend.dto.building.BuildingDetailDTO;
import com.ediflow.backend.dto.building.BuildingSummaryDTO;
import com.ediflow.backend.dto.resident.ResidentSummaryDTO;
import com.ediflow.backend.entity.Building;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface IBuildingService {

    ResponseEntity<BuildingDTO> createBuilding(BuildingDTO newBuilding, Long adminAccountId);
    ResponseEntity<BuildingDetailDTO> buildingDetail(Long id);

    ResponseEntity<ResidentSummaryDTO> residentSummary(Long id);

    List<BuildingDTO> findAllForAdminPanel(Long adminId);

    ResponseEntity<String> updateBuilding(Long id, BuildingDTO buildingDTO);

    ResponseEntity<String> deleteBuilding (Long id);

    List<BuildingSummaryDTO> findAllBuildings();

    List<BuildingDTO> findAllByAdminAccount(Long adminAccountId);
    List<BuildingDTO> findBuildingsByAdminAccountId(Long adminAccountId);
    Long getAdminAccountIdByUserEmail(String email);
}
