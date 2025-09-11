package com.ediflow.backend.controller;

import com.ediflow.backend.dto.logEntry.CreateLogEntryRequestDTO;
import com.ediflow.backend.dto.logEntry.LogEntryDTO;
import com.ediflow.backend.entity.LogEntry;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.enums.EntryType;
import com.ediflow.backend.service.ILogEntryService;
import com.ediflow.backend.service.IUserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/log-entries")
public class LogEntryController {
    private final ILogEntryService service;
    private final IUserService userService;

    public LogEntryController(ILogEntryService service, IUserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN','PORTER')")
    public ResponseEntity<LogEntryDTO> create(@RequestBody CreateLogEntryRequestDTO req) {
        LogEntryDTO dto = service.create(req);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/resident/{residentId}")
    @PreAuthorize("hasAnyRole('RESIDENT','ADMIN','EMPLOYEE')")
    public ResponseEntity<List<LogEntryDTO>> getByResident(@PathVariable Long residentId, Principal principal) {
        User requester = userService.findByEmail(principal.getName());

        if (requester.hasRole("RESIDENT") && !requester.getResident().getId().equals(residentId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(service.findByResident(residentId));
    }

    @GetMapping("/building/{buildingId}")
    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE','SUPPORT','PORTER')")
    public ResponseEntity<List<LogEntryDTO>> getByBuilding(
            @PathVariable Long buildingId,
            @RequestParam(required = false) EntryType type,
            Principal principal) {

        User requester = userService.findByEmail(principal.getName());

        // Validación de acceso
        boolean canAccess = requester.hasRole("ADMIN")
                || requester.hasRole("EMPLOYEE")
                || requester.hasRole("SUPPORT")
                || (requester.hasRole("PORTER")
                && requester.getBuilding() != null
                && requester.getBuilding().getId().equals(buildingId));

        if (!canAccess) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(null);
        }

        List<LogEntryDTO> entries;
        if (type != null) {
            entries = service.findByBuildingAndType(buildingId, type);
        } else {
            entries = service.findByBuilding(buildingId);
        }

        return ResponseEntity.ok(entries);
    }
}
