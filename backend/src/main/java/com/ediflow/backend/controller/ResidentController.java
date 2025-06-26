package com.ediflow.backend.controller;

import com.ediflow.backend.dto.apartment.ApartmentSummaryDTO;
import com.ediflow.backend.dto.resident.ResidentDTO;
import com.ediflow.backend.service.IResidentService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/residents")
public class ResidentController {
    @Autowired
    private IResidentService residentService;
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createResident(@RequestBody ResidentDTO newResident) {
        return residentService.createResident(newResident);
    }
    @PreAuthorize("hasAnyRole('ADMIN', 'RESIDENT')")
    @GetMapping("/all")
    public ResponseEntity<List<ResidentDTO>> findAll(){
        List<ResidentDTO> residents = residentService.findAll();
        return new ResponseEntity<>(residents, HttpStatus.OK);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateResident(@PathVariable Long id, @RequestBody @Valid ResidentDTO residentDTO){
        return residentService.updateResident(id,residentDTO);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteResident(@PathVariable Long id) {
        return residentService.deleteResident(id);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('RESIDENT') or hasRole('ADMIN')")
    public ResponseEntity<ResidentDTO> getCurrentResident(Authentication authentication) {
        String email = authentication.getName(); // usuario autenticado
        ResidentDTO residentDTO = residentService.findByUserEmail(email); // implementá este método
        return ResponseEntity.ok(residentDTO);
    }

}
