package com.ediflow.backend.controller;

import com.ediflow.backend.dto.ApartmentDTO;

import com.ediflow.backend.service.IApartmentService;
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
        apartmentService.createApartment(newApartment);
        return new ResponseEntity<>("Apartamento creado correctamente", HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ApartmentDTO>> findAll(){
        List<ApartmentDTO> apartments = apartmentService.findAll();
        return new ResponseEntity<>(apartments, HttpStatus.OK);
    }

}
