package com.ediflow.backend.service;

import com.ediflow.backend.dto.commonarea.CommonAreaDTO;
import com.ediflow.backend.dto.commonarea.CommonAreaReservationDTO;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

public interface ICommonAreaReservationService {
    CommonAreaReservationDTO create(CommonAreaReservationDTO dto);
    CommonAreaReservationDTO createWithUserEmail(CommonAreaReservationDTO dto, String userEmail);
    List<CommonAreaReservationDTO> findByResidentEmail(String email);
    List<CommonAreaReservationDTO> findByBuildingId(Long buildingId);
    ResponseEntity<String> deleteReservation(Long id, String email);
    List<CommonAreaReservationDTO> findByAreaAndDate(Long commonAreaId, LocalDate date);
    List<CommonAreaDTO> findAllFiltered(Long adminAccountId, Long adminId);
    List<CommonAreaDTO> findAllFiltered();
}
