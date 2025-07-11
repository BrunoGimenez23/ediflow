package com.ediflow.backend.service.impl;

import com.ediflow.backend.dto.commonarea.CommonAreaDTO;
import com.ediflow.backend.dto.commonarea.CommonAreaReservationDTO;
import com.ediflow.backend.entity.CommonArea;
import com.ediflow.backend.entity.CommonAreaReservation;
import com.ediflow.backend.entity.Resident;
import com.ediflow.backend.repository.ICommonAreaRepository;
import com.ediflow.backend.repository.ICommonAreaReservationRepository;
import com.ediflow.backend.repository.IResidentRepository;
import com.ediflow.backend.repository.IUserRepository;
import com.ediflow.backend.service.IAdminService;
import com.ediflow.backend.service.ICommonAreaReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
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
    private IUserRepository userRepo;
    @Autowired
    private IAdminService adminService;


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

        var user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));


        var resident = residentRepo.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Residente no encontrado"));


        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        return reservationRepo.findByResidentId(resident.getId()).stream()
                .filter(r -> {

                    if (r.getDate().isAfter(today)) return true;


                    if (r.getDate().isEqual(today)) {
                        return r.getEndTime().isAfter(now);
                    }


                    return false;
                })
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<CommonAreaReservationDTO> findByBuildingId(Long buildingId) {

        var commonAreas = areaRepo.findByBuildingId(buildingId);


        return commonAreas.stream()
                .flatMap(area -> reservationRepo.findByCommonAreaId(area.getId()).stream())
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ResponseEntity<String> deleteReservation(Long id, String email) {

        CommonAreaReservation reservation = reservationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));


        var user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        var resident = residentRepo.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Residente no encontrado"));


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


        dto.setResidentId(resident.getId());

        return create(dto);
    }

    @Override
    public List<CommonAreaDTO> findAllFiltered() {
        System.out.println("[DEBUG] findAllFiltered() llamado");
        var user = adminService.getLoggedUser();

        System.out.println("[DEBUG] Usuario logueado: " + user.getEmail() + ", rol: " + user.getRole().name());

        if (user.getRole().name().equals("RESIDENT")) {
            var resident = residentRepo.findByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("Residente no encontrado"));

            Long buildingId = resident.getApartment().getBuilding().getId();
            System.out.println("[DEBUG] Resident vive en edificio con ID: " + buildingId);

            List<CommonArea> areas = areaRepo.findByBuildingId(buildingId);

            System.out.println("[DEBUG] Áreas comunes encontradas para edificio: " + areas.size());
            areas.forEach(a -> System.out.println(" - Área común: " + a.getName() + " (ID " + a.getId() + ")"));

            return areas.stream()
                    .map(this::mapCommonAreaToDTO)
                    .collect(Collectors.toList());
        }

        Long adminAccountId = user.getAdminAccount() != null ? user.getAdminAccount().getId() : null;
        Long adminId = user.getAdmin() != null ? user.getAdmin().getId() : null;

        List<CommonArea> areas;

        if (adminAccountId != null) {
            areas = areaRepo.findByBuilding_Admin_User_AdminAccount_Id(adminAccountId);
        } else if (adminId != null) {
            areas = areaRepo.findByBuilding_Admin_Id(adminId);
        } else {
            areas = Collections.emptyList();
        }

        System.out.println("[DEBUG] Áreas comunes encontradas para admin/adminAccount: " + areas.size());

        return areas.stream()
                .map(this::mapCommonAreaToDTO)
                .collect(Collectors.toList());
    }


    @Override
    public List<CommonAreaDTO> findAllFiltered(Long adminAccountId, Long adminId) {
        List<CommonArea> areas;

        if (adminAccountId != null) {

            areas = areaRepo.findByBuilding_Admin_User_AdminAccount_Id(adminAccountId);
        } else if (adminId != null) {

            areas = areaRepo.findByBuilding_Admin_Id(adminId);
        } else {

            return Collections.emptyList();
        }

        return areas.stream()
                .map(this::mapCommonAreaToDTO)
                .collect(Collectors.toList());
    }
    private CommonAreaDTO mapCommonAreaToDTO(CommonArea area) {
        CommonAreaDTO dto = new CommonAreaDTO();
        dto.setId(area.getId());
        dto.setName(area.getName());
        dto.setDescription(area.getDescription());
        dto.setCapacity(area.getCapacity());
        dto.setBuildingId(area.getBuilding().getId());
        return dto;
    }
}