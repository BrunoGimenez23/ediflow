package com.ediflow.backend.service;

import com.ediflow.backend.dto.resident.RegisterOrReplaceResidentRequest;
import com.ediflow.backend.dto.resident.ResidentDTO;
import com.ediflow.backend.entity.Resident;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface IResidentService {

    ResponseEntity<Map<String, String>> createResident(ResidentDTO newResident);

    Optional<Resident> findById (Long id);


    ResponseEntity<String> updateResident(Long id, ResidentDTO residentDTO);

    ResponseEntity<String> deleteResident (Long id);

    List<ResidentDTO> findAll();
    ResidentDTO findByUserEmail(String email);
    List<ResidentDTO> findAllByAdminAccount(Long adminAccountId);
    Long getAdminAccountIdByUserEmail(String email);
    Page<ResidentDTO> findByBuildingId(Long buildingId, Pageable pageable);
    ResponseEntity<String> assignAdminAccountToExistingResidents();
    Page<ResidentDTO> findAllPaginated(Long adminAccountId, Long buildingId, Pageable pageable);
    ResidentDTO createOrReplaceResident(ResidentDTO residentDTO);
    public void replaceResident(Long apartmentId, Long userId);
    Resident registerOrReplaceResident(RegisterOrReplaceResidentRequest request);

}
