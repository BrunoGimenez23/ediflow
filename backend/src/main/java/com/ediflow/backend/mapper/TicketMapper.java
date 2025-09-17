package com.ediflow.backend.mapper;

import com.ediflow.backend.dto.tickets.TicketRequestDTO;
import com.ediflow.backend.dto.tickets.TicketResponseDTO;
import com.ediflow.backend.entity.Building;
import com.ediflow.backend.entity.Ticket;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.enums.tikets.TicketPriority;
import com.ediflow.backend.enums.tikets.TicketStatus;
import org.springframework.stereotype.Component;

@Component
public class TicketMapper {

    public Ticket toEntity(TicketRequestDTO dto, User user, Building building) {
        Ticket ticket = new Ticket();
        ticket.setTitle(dto.getTitle());
        ticket.setDescription(dto.getDescription());
        ticket.setType(dto.getType());
        ticket.setPriority(dto.getPriority() != null ? dto.getPriority() : TicketPriority.MEDIUM);
        ticket.setCreatedBy(user);
        ticket.setBuilding(building);
        ticket.setStatus(TicketStatus.PENDING);
        return ticket;
    }

    public TicketResponseDTO toDTO(Ticket ticket) {
        TicketResponseDTO dto = new TicketResponseDTO();
        dto.setId(ticket.getId());
        dto.setTitle(ticket.getTitle());
        dto.setDescription(ticket.getDescription());
        dto.setStatus(ticket.getStatus());
        dto.setType(ticket.getType());
        dto.setPriority(ticket.getPriority());
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setUpdatedAt(ticket.getUpdatedAt());
        dto.setCreatedByName(ticket.getCreatedBy() != null ? ticket.getCreatedBy().getUsername() : "Sistema");
        dto.setBuildingId(ticket.getBuilding() != null ? ticket.getBuilding().getId() : null);
        return dto;
    }
}
