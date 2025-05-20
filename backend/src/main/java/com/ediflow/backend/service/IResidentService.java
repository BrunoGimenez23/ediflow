package com.ediflow.backend.service;

import com.ediflow.backend.dto.resident.ResidentDTO;
import com.ediflow.backend.entity.Resident;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface IResidentService {

    ResponseEntity<String> createResident(ResidentDTO newResident);

    Optional<Resident> findById (Long id);


    ResponseEntity<String> updateResident(Long id, ResidentDTO residentDTO);

    ResponseEntity<String> deleteResident (Long id);

    List<ResidentDTO> findAll();

}
