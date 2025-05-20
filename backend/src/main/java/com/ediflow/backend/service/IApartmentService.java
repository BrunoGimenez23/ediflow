package com.ediflow.backend.service;

import com.ediflow.backend.dto.apartment.ApartmentDTO;
import com.ediflow.backend.dto.apartment.ApartmentSummaryDTO;
import com.ediflow.backend.entity.Apartment;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface IApartmentService {

    ResponseEntity<String> createApartment(ApartmentDTO newApartment);
    Optional<Apartment> findById(Long id);
    ResponseEntity<String> updateApartment (Long id, ApartmentDTO apartmentDTO);
    ResponseEntity<String> deleteApartment(Long id);
    List<ApartmentDTO> findAll();

    List<ApartmentSummaryDTO> findByBuildingId(Long id);
}
