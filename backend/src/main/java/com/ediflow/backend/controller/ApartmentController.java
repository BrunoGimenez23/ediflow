package com.ediflow.backend.controller;

import com.ediflow.backend.dto.apartment.ApartmentDTO;
import com.ediflow.backend.dto.apartment.ApartmentSummaryDTO;
import com.ediflow.backend.dto.apartment.AssignResidentRequestDTO;
import com.ediflow.backend.service.IApartmentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/apartment")
public class ApartmentController {
    @Autowired
    private IApartmentService apartmentService;

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createApartment(@RequestBody ApartmentDTO newApartment) {
        return apartmentService.createApartment(newApartment);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<List<ApartmentDTO>> findAll(Authentication authentication) {
        String email = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("");
        List<ApartmentDTO> apartments = apartmentService.findAllByUser(email, role);
        return new ResponseEntity<>(apartments, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, String>> deleteApartment(@PathVariable @Valid Long id) {
        return apartmentService.deleteApartment(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, String>> updateApartment(@PathVariable Long id, @RequestBody ApartmentDTO apartmentDTO) {
        return apartmentService.updateApartment(id, apartmentDTO);
    }


    @PreAuthorize("hasAnyRole('ADMIN', 'RESIDENT')")
    @GetMapping("/by-building/{id}")
    public ResponseEntity<List<ApartmentSummaryDTO>> getApartmentsByBuilding(@PathVariable Long id) {
        List<ApartmentSummaryDTO> apartments = apartmentService.findByBuildingId(id);
        return ResponseEntity.ok(apartments);
    }

    @PreAuthorize("hasRole('RESIDENT')")
    @GetMapping("/me")
    public ResponseEntity<ApartmentDTO> getMyApartment(Authentication authentication) {
        String email = authentication.getName();
        ApartmentDTO apartmentDTO = apartmentService.findByResidentEmail(email);
        if (apartmentDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(apartmentDTO);
    }

    @GetMapping("/paged")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<Page<ApartmentDTO>> getPagedApartments(
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) Long buildingId,
            @PageableDefault(size = 10) Pageable pageable,
            Authentication authentication) {

        String email = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("");

        Page<ApartmentDTO> apartmentsPage = apartmentService.findPagedByUserAndBuilding(email, role, filter, buildingId, pageable);

        return ResponseEntity.ok(apartmentsPage);
    }
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PostMapping("/assign-resident")
    public ResponseEntity<?> assignResident(@RequestBody AssignResidentRequestDTO request) {
        boolean assigned = apartmentService.assignResident(request.getApartmentId(), request.getUserId());
        if (assigned) {
            return ResponseEntity.ok(Map.of("success", true));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", "No se pudo asignar el residente"));
        }
    }
}
