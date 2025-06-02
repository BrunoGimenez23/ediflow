package com.ediflow.backend.controller;

import com.ediflow.backend.dto.apartment.ApartmentDTO;

import com.ediflow.backend.dto.apartment.ApartmentSummaryDTO;
import com.ediflow.backend.service.IApartmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/apartment")
public class ApartmentController {
    @Autowired
    private IApartmentService apartmentService;
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<String> createApartment(@RequestBody ApartmentDTO newApartment){
        return apartmentService.createApartment(newApartment);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<ApartmentDTO>> findAll(){
        List<ApartmentDTO> apartments = apartmentService.findAll();
        return new ResponseEntity<>(apartments, HttpStatus.OK);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteApartment(@PathVariable @Valid Long id){
        return apartmentService.deleteApartment(id);

    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateApartment(@PathVariable Long id,@RequestBody ApartmentDTO apartmentDTO){
        return apartmentService.updateApartment(id,apartmentDTO);
    }
    @PreAuthorize("hasAnyRole('ADMIN', 'RESIDENT')")
    @GetMapping("/by-building/{id}")
    public ResponseEntity<List<ApartmentSummaryDTO>> getApartmentsByBuilding(@PathVariable Long id) {
        List<ApartmentSummaryDTO> apartments = apartmentService.findByBuildingId(id);
        return ResponseEntity.ok(apartments);
    }

}
