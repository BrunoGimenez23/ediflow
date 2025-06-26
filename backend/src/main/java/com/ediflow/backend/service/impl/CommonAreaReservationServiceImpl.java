package com.ediflow.backend.service.impl;

import com.ediflow.backend.dto.commonarea.CommonAreaReservationDTO;
import com.ediflow.backend.entity.CommonArea;
import com.ediflow.backend.entity.CommonAreaReservation;
import com.ediflow.backend.entity.Resident;
import com.ediflow.backend.repository.ICommonAreaRepository;
import com.ediflow.backend.repository.ICommonAreaReservationRepository;
import com.ediflow.backend.repository.IResidentRepository;
import com.ediflow.backend.repository.IUserRepository;
import com.ediflow.backend.service.ICommonAreaReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommonAreaReservationServiceImpl implements ICommonAreaReservationService {

    @Autowired
    private ICommonAreaReservationRepository reservationRepo;

    @Autowired
    private ICommonAreaRepository areaRepo;

    @Autowired
    private IResidentRepository residentRepo;

    @Autowired
    private IUserRepository userRepo;  // Necesitarás esto para buscar usuario por email

    @Override
    public CommonAreaReservationDTO create(CommonAreaReservationDTO dto) {
        CommonArea area = areaRepo.findById(dto.getCommonAreaId())
                .orElseThrow(() -> new RuntimeException("Área común no encontrada"));

        Resident resident = residentRepo.findById(dto.getResidentId())
                .orElseThrow(() -> new RuntimeException("Residente no encontrado"));

        CommonAreaReservation reservation = CommonAreaReservation.builder()
                .commonArea(area)
                .resident(resident)
                .date(dto.getDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .build();

        CommonAreaReservation saved = reservationRepo.save(reservation);

        dto.setId(saved.getId());
        return dto;
    }
    @Override
    public List<CommonAreaReservationDTO> findByAreaAndDate(Long commonAreaId, LocalDate date) {
        return reservationRepo.findByCommonAreaIdAndDate(commonAreaId, date)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CommonAreaReservationDTO> findByResidentEmail(String email) {
        // Buscar usuario por email
        var user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Buscar residente por userId
        var resident = residentRepo.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Residente no encontrado"));

        // Obtener fecha y hora actual
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        return reservationRepo.findByResidentId(resident.getId()).stream()
                .filter(r -> {
                    // Incluir si la reserva es en una fecha futura
                    if (r.getDate().isAfter(today)) return true;

                    // Incluir si es hoy y todavía no terminó
                    if (r.getDate().isEqual(today)) {
                        return r.getEndTime().isAfter(now);
                    }

                    // Si la fecha ya pasó, filtrar
                    return false;
                })
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CommonAreaReservationDTO> findByBuildingId(Long buildingId) {
        // Obtener todas las áreas comunes del edificio
        var commonAreas = areaRepo.findByBuildingId(buildingId);

        // Para cada área común obtener las reservas
        return commonAreas.stream()
                .flatMap(area -> reservationRepo.findByCommonAreaId(area.getId()).stream())
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ResponseEntity<String> deleteReservation(Long id, String email) {
        // Validar que la reserva exista
        CommonAreaReservation reservation = reservationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        // Buscar usuario y residente para validar permiso
        var user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        var resident = residentRepo.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Residente no encontrado"));

        // Solo puede eliminar si es admin o el mismo residente dueño de la reserva
        if (user.getRole().name().equals("ADMIN") || reservation.getResident().getId().equals(resident.getId())) {
            reservationRepo.deleteById(id);
            return ResponseEntity.ok("Reserva eliminada correctamente");
        } else {
            return ResponseEntity.status(403).body("No tiene permiso para eliminar esta reserva");
        }
    }

    private CommonAreaReservationDTO mapToDTO(CommonAreaReservation res) {
        return CommonAreaReservationDTO.builder()
                .id(res.getId())
                .residentId(res.getResident().getId())
                .commonAreaId(res.getCommonArea().getId())
                .commonAreaName(res.getCommonArea().getName())
                .date(res.getDate())
                .startTime(res.getStartTime())
                .endTime(res.getEndTime())
                .residentFullName(res.getResident().getUser().getFullName())
                .build();
    }
    public CommonAreaReservationDTO createWithUserEmail(CommonAreaReservationDTO dto, String userEmail) {
        Resident resident = residentRepo.findByUserEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Residente no encontrado"));

        // Usar resident.getId() para completar dto
        dto.setResidentId(resident.getId());

        return create(dto);
    }
}