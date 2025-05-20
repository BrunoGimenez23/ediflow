package com.ediflow.backend.controller;

import com.ediflow.backend.dto.apartment.ApartmentDTO;

import com.ediflow.backend.dto.apartment.ApartmentSummaryDTO;
import com.ediflow.backend.service.IApartmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/apartment")
public class ApartmentController {
    @Autowired
    private IApartmentService apartmentService;

    @PostMapping("/create")
    public ResponseEntity<String> createApartment(@RequestBody ApartmentDTO newApartment){
        return apartmentService.createApartment(newApartment);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ApartmentDTO>> findAll(){
        List<ApartmentDTO> apartments = apartmentService.findAll();
        return new ResponseEntity<>(apartments, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteApartment(@PathVariable @Valid Long id){
        return apartmentService.deleteApartment(id);

    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateApartment(@PathVariable Long id,@RequestBody ApartmentDTO apartmentDTO){
        return apartmentService.updateApartment(id,apartmentDTO);
    }

    @GetMapping("/by-building/{id}")
    public ResponseEntity<List<ApartmentSummaryDTO>> getApartmentsByBuilding(@PathVariable Long id) {
        List<ApartmentSummaryDTO> apartments = apartmentService.findByBuildingId(id);
        return ResponseEntity.ok(apartments);
    }

}
