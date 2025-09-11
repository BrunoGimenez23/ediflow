package com.ediflow.backend.service.impl;

import com.ediflow.backend.dto.logEntry.CreateLogEntryRequestDTO;
import com.ediflow.backend.dto.logEntry.LogEntryDTO;
import com.ediflow.backend.entity.Building;
import com.ediflow.backend.entity.LogEntry;
import com.ediflow.backend.entity.Resident;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.enums.EntryType;
import com.ediflow.backend.repository.ILogEntryRepository;
import com.ediflow.backend.repository.IResidentRepository;
import com.ediflow.backend.service.ILogEntryService;
import com.ediflow.backend.service.NotificationService;
import com.ediflow.backend.service.IUserService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LogEntryServiceImpl implements ILogEntryService {

    private final ILogEntryRepository logEntryRepository;
    private final IResidentRepository residentRepo;
    private final IUserService userService;
    private final NotificationService notificationService;

    public LogEntryServiceImpl(ILogEntryRepository logEntryRepository,
                               IResidentRepository residentRepo,
                               IUserService userService,
                               NotificationService notificationService) {
        this.logEntryRepository = logEntryRepository;
        this.residentRepo = residentRepo;
        this.userService = userService;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional
    public LogEntryDTO create(CreateLogEntryRequestDTO req) {
        User creator = userService.getLoggedUser();

        // Traer residente
        Resident resident = residentRepo.findById(req.getResidentId())
                .orElseThrow(() -> new RuntimeException("Resident not found"));

        Building building = resident.getApartment().getBuilding();

        // Validar acceso según rol
        if (creator.hasRole("ADMIN") || creator.hasRole("EMPLOYEE")) {
            // Admin y empleado: acceso total
        } else if (creator.hasRole("PORTER")) {
            // Portero: solo puede crear logs de PAQUETE o VISITA para su edificio
            if (!creator.getBuilding().getId().equals(building.getId())) {
                throw new RuntimeException("Access denied to this building");
            }
            if (req.getType() != EntryType.PAQUETE && req.getType() != EntryType.VISITA) {
                throw new RuntimeException("Porter solo puede crear logs de PAQUETE o VISITA");
            }
        } else {
            throw new RuntimeException("Access denied");
        }

        // Crear log
        LogEntry e = new LogEntry();
        e.setResident(resident);
        e.setBuilding(building);
        e.setType(req.getType());
        e.setDescription(req.getDescription());
        e.setCreatedBy(creator);

        LogEntry saved = logEntryRepository.save(e);

        // Envío de notificación
        notificationService.notifyResidentNewLogEntry(resident, saved);

        return toDto(saved);
    }

    @Override
    public List<LogEntryDTO> findByResident(Long residentId) {
        return logEntryRepository.findByResidentIdOrderByCreatedAtDesc(residentId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<LogEntryDTO> findByBuilding(Long buildingId) {
        return logEntryRepository.findByBuildingIdOrderByCreatedAtDesc(buildingId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<LogEntryDTO> findByBuildingAndType(Long buildingId, EntryType type) {
        return logEntryRepository.findByBuildingIdAndTypeOrderByCreatedAtDesc(buildingId, type)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // Método privado para mapear a DTO
    private LogEntryDTO toDto(LogEntry entry) {
        LogEntryDTO dto = new LogEntryDTO();
        dto.setId(entry.getId());
        dto.setType(entry.getType());
        dto.setDescription(entry.getDescription());
        dto.setCreatedAt(entry.getCreatedAt());
        dto.setResidentName(entry.getResident() != null ? entry.getResident().getUser().getUsername() : null);
        dto.setCreatedByName(entry.getCreatedBy() != null ? entry.getCreatedBy().getUsername() : null);
        return dto;
    }
}
