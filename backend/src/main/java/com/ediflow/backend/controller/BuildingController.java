package com.ediflow.backend.controller;

import com.ediflow.backend.dto.building.BuildingDTO;
import com.ediflow.backend.dto.building.BuildingDetailDTO;
import com.ediflow.backend.dto.building.BuildingSummaryDTO;
import com.ediflow.backend.dto.resident.ResidentSummaryDTO;
import com.ediflow.backend.entity.Building;
import com.ediflow.backend.service.IBuildingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/buildings")
public class BuildingController {
    @Autowired
    private IBuildingService iBuildingService;
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/building")
    public ResponseEntity<String> createBuilding(@RequestBody BuildingDTO newBuilding) {
        return iBuildingService.createBuilding(newBuilding);

    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<BuildingDTO>> findAllForAdminPanel() {
        List<BuildingDTO> buildings = iBuildingService.findAllForAdminPanel();
        return new ResponseEntity<>(buildings, HttpStatus.OK);
    }
    @PreAuthorize("hasAnyRole('ADMIN', 'RESIDENT')")
    @GetMapping("/summary")
    public ResponseEntity<List<BuildingSummaryDTO>> findAllBuildings(){
        List<BuildingSummaryDTO> buildings = iBuildingService.findAllBuildings();
        return new ResponseEntity<>(buildings, HttpStatus.OK);
    }
    @PreAuthorize("hasAnyRole('ADMIN', 'RESIDENT')")
    @GetMapping("/building/{id}")
    public ResponseEntity<BuildingDetailDTO> buildingDetail(@PathVariable @Valid Long id){
        return iBuildingService.buildingDetail(id);

    }
    @PreAuthorize("hasAnyRole('ADMIN', 'RESIDENT')")
    @GetMapping("/{id}/residents")
    public ResponseEntity<ResidentSummaryDTO> residentSummary(@PathVariable @Valid Long id){
        return iBuildingService.residentSummary(id);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteBuilding(@PathVariable Long id) {
        return iBuildingService.deleteBuilding(id);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateBuilding(@PathVariable Long id, @Valid @RequestBody BuildingDTO buildingDTO) {
        return iBuildingService.updateBuilding(id, buildingDTO);
    }
}
