package com.ediflow.backend.controller;

import com.ediflow.backend.dto.apartment.ApartmentSummaryDTO;
import com.ediflow.backend.dto.resident.ResidentDTO;
import com.ediflow.backend.service.IResidentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/residents")
public class ResidentController {
    @Autowired
    private IResidentService residentService;

    @PostMapping("/create")
    public ResponseEntity<String> createResident(@RequestBody ResidentDTO newResident) {
        return residentService.createResident(newResident);

    }

    @GetMapping("/all")
    public ResponseEntity<List<ResidentDTO>> findAll(){
        List<ResidentDTO> residents = residentService.findAll();
        return new ResponseEntity<>(residents, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateResident(@PathVariable Long id, @RequestBody @Valid ResidentDTO residentDTO){
        return residentService.updateResident(id,residentDTO);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteResident(@PathVariable Long id) {
        return residentService.deleteResident(id);
    }


}
