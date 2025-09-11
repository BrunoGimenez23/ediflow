package com.ediflow.backend.controller;

import com.ediflow.backend.dto.apartment.ApartmentSummaryDTO;
import com.ediflow.backend.dto.resident.RegisterOrReplaceResidentRequest;
import com.ediflow.backend.dto.resident.ReplaceResidentRequestDTO;
import com.ediflow.backend.dto.resident.ResidentDTO;
import com.ediflow.backend.dto.resident.ResidentResponseDTO;
import com.ediflow.backend.entity.Resident;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.repository.IUserRepository;
import com.ediflow.backend.service.IResidentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/residents")
public class ResidentController {
    @Autowired
    private IResidentService residentService;
    @Autowired
    private IUserRepository userRepository;
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createResident(@RequestBody ResidentDTO newResident) {
        return residentService.createResident(newResident);
    }
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'SUPPORT')")
    @GetMapping("/all")
    public ResponseEntity<Page<ResidentDTO>> findAllPaginated(
            @RequestParam(value = "buildingId", required = false) Long buildingId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<ResidentDTO> residentsPage = residentService.findAllPaginated(buildingId, pageable);

        return new ResponseEntity<>(residentsPage, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateResident(@PathVariable Long id, @RequestBody @Valid ResidentDTO residentDTO){
        return residentService.updateResident(id,residentDTO);
    }
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteResident(@PathVariable Long id) {
        return residentService.deleteResident(id);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('RESIDENT') or hasRole('ADMIN')")
    public ResponseEntity<ResidentDTO> getCurrentResident(Authentication authentication) {
        String email = authentication.getName();
        ResidentDTO residentDTO = residentService.findByUserEmail(email);
        return ResponseEntity.ok(residentDTO);
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping("/by-building/{buildingId}")
    public ResponseEntity<Page<ResidentDTO>> findByBuilding(
            @PathVariable Long buildingId,
            @PageableDefault(size = 20) Pageable pageable) {


        Pageable fixedPageable = PageRequest.of(pageable.getPageNumber(), 20, pageable.getSort());

        Page<ResidentDTO> residentsPage = residentService.findByBuildingId(buildingId, fixedPageable);
        return ResponseEntity.ok(residentsPage);
    }
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_EMPLOYEE')")
    @PostMapping("/create-or-replace")
    public ResponseEntity<ResidentDTO> createOrReplace(@RequestBody ResidentDTO residentDTO) {
        ResidentDTO result = residentService.createOrReplaceResident(residentDTO);
        return ResponseEntity.ok(result);
    }
    @PostMapping("/replace")
    public ResponseEntity<String> replaceResident(@RequestBody ReplaceResidentRequestDTO request) {
        residentService.replaceResident(request.getApartmentId(), request.getUserId());
        return ResponseEntity.ok("Residente reemplazado correctamente");
    }
    @PostMapping("/register-or-replace")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<ResidentResponseDTO> registerOrReplaceResident(
            @RequestBody @Valid RegisterOrReplaceResidentRequest request) {

        Resident resident = residentService.registerOrReplaceResident(request);

        ResidentResponseDTO response = new ResidentResponseDTO();
        response.setId(resident.getId());
        response.setFullName(resident.getUser().getFullName());
        response.setEmail(resident.getUser().getEmail());
        response.setApartmentId(resident.getApartment().getId());
        response.setCi(resident.getCi());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/by-building-porter/{buildingId}")
    @PreAuthorize("hasRole('PORTER')")
    public ResponseEntity<List<ResidentDTO>> findByBuildingForPorter(
            @PathVariable Long buildingId
    ) {
        List<ResidentDTO> residents = residentService.findByBuildingIdForPorter(buildingId);
        return ResponseEntity.ok(residents);
    }


}


