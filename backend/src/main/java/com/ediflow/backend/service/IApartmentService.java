package com.ediflow.backend.service;

import com.ediflow.backend.dto.ApartmentDTO;
import com.ediflow.backend.entity.Apartment;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface IApartmentService {

    ResponseEntity<String> createApartment(ApartmentDTO newApartment);
    Optional<Apartment> findById(Long id);
    void update (Apartment apartment);
    void delete(Long id);
    List<ApartmentDTO> findAll();
}
