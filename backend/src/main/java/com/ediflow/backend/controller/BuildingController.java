package com.ediflow.backend.controller;

import com.ediflow.backend.dto.BuildingDTO;
import com.ediflow.backend.entity.Building;
import com.ediflow.backend.service.IBuildingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/buildings")
public class BuildingController {
    @Autowired
    private IBuildingService iBuildingService;

    @PostMapping("/building")
    public String createBuilding(@RequestBody Building newBuilding){
        iBuildingService.createBuilding(newBuilding);
        return "Edificio creado";
    }

    @GetMapping("/all")
    public ResponseEntity<List<BuildingDTO>> findAll() {
        List<BuildingDTO> buildings = iBuildingService.findAll();
        return new ResponseEntity<>(buildings, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteBuilding(@PathVariable Long id) {
        iBuildingService.deleteBuilding(id);
        return new ResponseEntity<>("Edificio eliminado correctamente",HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateBuilding(@PathVariable Long id, @Valid @RequestBody BuildingDTO buildingDTO) {
        return iBuildingService.updateBuilding(id, buildingDTO);
    }
}
