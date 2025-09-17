package com.ediflow.backend.repository;

import com.ediflow.backend.dto.tickets.TicketRequestDTO;
import com.ediflow.backend.dto.tickets.TicketResponseDTO;
import com.ediflow.backend.entity.Ticket;
import com.ediflow.backend.enums.tikets.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ITicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByBuildingId(Long buildingId);
    List<Ticket> findByCreatedById(Long userId);
    @Query("SELECT t FROM Ticket t WHERE t.building.id = :buildingId AND (t.type = :type OR t.createdBy.id = :userId)")
    List<Ticket> findByBuildingIdAndTypeOrCreatedById(
            @Param("buildingId") Long buildingId,
            @Param("type") com.ediflow.backend.enums.tikets.TicketType type,
            @Param("userId") Long userId
    );
}