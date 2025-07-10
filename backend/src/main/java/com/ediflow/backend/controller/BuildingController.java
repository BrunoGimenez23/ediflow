package com.ediflow.backend.controller;

import com.ediflow.backend.dto.building.BuildingDTO;
import com.ediflow.backend.dto.building.BuildingDetailDTO;
import com.ediflow.backend.dto.building.BuildingSummaryDTO;
import com.ediflow.backend.dto.resident.ResidentSummaryDTO;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.repository.IUserRepository;
import com.ediflow.backend.service.IBuildingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/buildings")
@RequiredArgsConstructor
public class BuildingController {

    private final IBuildingService buildingService;
    private final IUserRepository userRepository;

    @PostMapping("/building")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<BuildingDTO> createBuilding(@RequestBody BuildingDTO newBuilding,
                                                      Authentication authentication) {
        String email = authentication.getName();
        return buildingService.createBuilding(newBuilding, email);
    }


    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<List<BuildingDTO>> findAllForAdminPanel(@AuthenticationPrincipal User user) {
        Long adminAccountId = null;
        if (user != null && user.getAdminAccount() != null) {
            adminAccountId = user.getAdminAccount().getId();
        }
        List<BuildingDTO> buildings = buildingService.findAllByAdminAccount(adminAccountId);
        return ResponseEntity.ok(buildings);
    }
    @PreAuthorize("hasAnyRole('ADMIN', 'RESIDENT')")
    @GetMapping("/summary")
    public ResponseEntity<List<BuildingSummaryDTO>> findAllBuildings() {
        List<BuildingSummaryDTO> buildings = buildingService.findAllBuildings();
        return new ResponseEntity<>(buildings, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'RESIDENT')")
    @GetMapping("/building/{id}")
    public ResponseEntity<BuildingDetailDTO> buildingDetail(@PathVariable @Valid Long id) {
        return buildingService.buildingDetail(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'RESIDENT')")
    @GetMapping("/{id}/residents")
    public ResponseEntity<ResidentSummaryDTO> residentSummary(@PathVariable @Valid Long id) {
        return buildingService.residentSummary(id);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_EMPLOYEE')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteBuilding(@PathVariable Long id) {
        return buildingService.deleteBuilding(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateBuilding(@PathVariable Long id, @Valid @RequestBody BuildingDTO buildingDTO) {
        return buildingService.updateBuilding(id, buildingDTO);
    }

    @GetMapping("/by-admin")
    public ResponseEntity<List<BuildingDTO>> getBuildingsByAdmin(Authentication authentication) {
        String email = authentication.getName();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.ok(List.of());

        User user = userOpt.get();
        List<BuildingDTO> buildings = buildingService.findBuildingsForUser(user);
        return ResponseEntity.ok(buildings);
    }
    @GetMapping("/for-user")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<List<BuildingDTO>> findBuildingsForUser(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(List.of());
        }

        List<BuildingDTO> buildings = buildingService.findBuildingsForUser(user);
        return ResponseEntity.ok(buildings);
    }


}
