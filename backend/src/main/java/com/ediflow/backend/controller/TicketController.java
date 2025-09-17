package com.ediflow.backend.controller;

import com.ediflow.backend.dto.tickets.TicketRequestDTO;
import com.ediflow.backend.dto.tickets.TicketResponseDTO;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.enums.tikets.TicketStatus;
import com.ediflow.backend.mapper.TicketMapper;
import com.ediflow.backend.service.ITicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final ITicketService ticketService;
    private final TicketMapper ticketMapper;

    @PostMapping("/create")
    public ResponseEntity<TicketResponseDTO> createTicket(@RequestBody TicketRequestDTO dto) {
        return ResponseEntity.ok(ticketService.createTicket(dto));
    }

    @GetMapping("/all")
    public ResponseEntity<List<TicketResponseDTO>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/by-building/{buildingId}")
    public ResponseEntity<List<TicketResponseDTO>> getTicketsByBuilding(
            @PathVariable Long buildingId,
            @AuthenticationPrincipal User loggedUser
    ) {
        return ResponseEntity.ok(ticketService.getTicketsByBuilding(buildingId, loggedUser));
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<TicketResponseDTO>> getTicketsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ticketService.getTicketsByUser(userId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<TicketResponseDTO> updateTicketStatus(
            @PathVariable Long id,
            @RequestParam TicketStatus status
    ) {
        return ResponseEntity.ok(ticketService.updateTicketStatus(id, status));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
}
