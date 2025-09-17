package com.ediflow.backend.service;

import com.ediflow.backend.dto.tickets.TicketRequestDTO;
import com.ediflow.backend.dto.tickets.TicketResponseDTO;
import com.ediflow.backend.entity.Ticket;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.enums.tikets.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.List;


public interface ITicketService {
    TicketResponseDTO createTicket(TicketRequestDTO dto);
    List<TicketResponseDTO> getAllTickets();
    List<TicketResponseDTO> getTicketsByBuilding(Long buildingId, User loggedUser);
    List<TicketResponseDTO> getTicketsByUser(Long userId);
    TicketResponseDTO updateTicketStatus(Long id, TicketStatus status);
    void deleteTicket(Long id);
}
