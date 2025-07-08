package com.ediflow.backend.service;

import com.ediflow.backend.dto.apartment.ApartmentDTO;
import com.ediflow.backend.dto.apartment.ApartmentSummaryDTO;
import com.ediflow.backend.entity.Apartment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface IApartmentService {

    ResponseEntity<Map<String, String>> createApartment(ApartmentDTO newApartment);
    ResponseEntity<Map<String, String>> updateApartment(Long id, ApartmentDTO apartmentDTO);
    ResponseEntity<Map<String, String>> deleteApartment(Long id);
    List<ApartmentDTO> findAll();
    List<ApartmentSummaryDTO> findByBuildingId(Long id);
    Optional<Apartment> findById(Long id);
    ApartmentDTO findByResidentEmail(String email);
    List<ApartmentDTO> findAllByUser(String email, String role);
    Page<ApartmentDTO> findPagedByUserAndFilter(String email, String role, String filter, Pageable pageable);
    Page<ApartmentDTO> findPagedByUserAndBuilding(String email, String role, String filter, Long buildingId, Pageable pageable);
    boolean assignResident(Long apartmentId, Long userId);

}
