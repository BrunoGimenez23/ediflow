package com.ediflow.backend.controller;

import com.ediflow.backend.dto.commonarea.CommonAreaDTO;
import com.ediflow.backend.dto.commonarea.CommonAreaReservationDTO;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.service.ICommonAreaReservationService;
import com.ediflow.backend.service.ICommonAreaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/reservations")
public class CommonAreaReservationController {


    private final ICommonAreaReservationService reservationService;

    private final ICommonAreaService commonAreaService;

    public CommonAreaReservationController(ICommonAreaReservationService reservationService, ICommonAreaService commonAreaService) {
        this.reservationService = reservationService;
        this.commonAreaService = commonAreaService;
    }


    @PreAuthorize("hasRole('RESIDENT')")
    @PostMapping("/create")
    public ResponseEntity<CommonAreaReservationDTO> createReservation(@Valid @RequestBody CommonAreaReservationDTO dto, Principal principal) {
        String userEmail = principal.getName();
        CommonAreaReservationDTO created = reservationService.createWithUserEmail(dto, userEmail);
        return ResponseEntity.ok(created);
    }


    @PreAuthorize("hasRole('RESIDENT')")
    @GetMapping("/my-reservations")
    public ResponseEntity<List<CommonAreaReservationDTO>> getMyReservations(Principal principal) {
        return ResponseEntity.ok(reservationService.findByResidentEmail(principal.getName()));
    }


    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE', 'SUPPORT')")
    @GetMapping("/by-building/{buildingId}")
    public ResponseEntity<List<CommonAreaReservationDTO>> getReservationsByBuilding(@PathVariable Long buildingId) {
        return ResponseEntity.ok(reservationService.findByBuildingId(buildingId));
    }


    @PreAuthorize("hasAnyRole('ADMIN', 'RESIDENT', 'EMPLOYEE', 'SUPPORT')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteReservation(@PathVariable Long id, Principal principal) {
        return reservationService.deleteReservation(id, principal.getName());
    }

    @GetMapping("/common-areas/user")
    public ResponseEntity<List<CommonAreaDTO>> findCommonAreasForUser() {
        System.out.println("[TRACE] Controlador: findCommonAreasForUser() llamado");
        var areas = reservationService.findAllFiltered();
        System.out.println("[TRACE] Áreas obtenidas: " + areas.size());
        return ResponseEntity.ok(areas);
    }


    @PreAuthorize("hasAnyRole('ADMIN', 'RESIDENT', 'EMPLOYEE', 'SUPPORT')")
    @GetMapping("/by-area/{commonAreaId}")
    public ResponseEntity<List<CommonAreaReservationDTO>> getReservationsByAreaAndDate(
            @PathVariable Long commonAreaId,
            @RequestParam String date) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            List<CommonAreaReservationDTO> reservations = reservationService.findByAreaAndDate(commonAreaId, localDate);
            return ResponseEntity.ok(reservations);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().build();
        }
    }



}