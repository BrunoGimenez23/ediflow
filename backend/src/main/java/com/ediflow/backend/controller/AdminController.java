package com.ediflow.backend.controller;

import com.ediflow.backend.dto.admin.AdminDTO;
import com.ediflow.backend.dto.building.BuildingDTO;
import com.ediflow.backend.dto.building.BuildingDetailDTO;
import com.ediflow.backend.dto.building.BuildingSummaryDTO;
import com.ediflow.backend.exception.ResourceNotFoundException;
import com.ediflow.backend.service.IAdminService;
import com.ediflow.backend.service.IBuildingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private IAdminService iadminservice;
    @Autowired
    private IBuildingService buildingService;

    @PostMapping("/create")
    public ResponseEntity<?> createAdmin(@RequestBody AdminDTO newAdmin) {
        AdminDTO createdAdmin = iadminservice.createAdmin(newAdmin);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdAdmin.getId())
                .toUri();

        return ResponseEntity.created(location).body(createdAdmin);
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAdmin(@PathVariable Long id) {
        return iadminservice.deleteAdmin(id);

    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminDTO> getAdminById(@PathVariable Long id) {
        AdminDTO admin = iadminservice.getAdminById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + id));
        return ResponseEntity.ok(admin);
    }

    @GetMapping("/all")
    public ResponseEntity<List<AdminDTO>> findAll() {
        List<AdminDTO> admins = iadminservice.findAll();
        return new ResponseEntity<>(admins, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateAdmin(@PathVariable @Valid Long id, @RequestBody AdminDTO adminDTO){
        return iadminservice.updateAdmin(id, adminDTO);

    }

    @GetMapping("/{id}/buildings")
    public ResponseEntity<List<BuildingSummaryDTO>> getBuildingsOfAdmin(@PathVariable Long id) {
        List<BuildingSummaryDTO> buildings = buildingService.findAllForAdminPanel(id);
        return ResponseEntity.ok(buildings);
    }

}
