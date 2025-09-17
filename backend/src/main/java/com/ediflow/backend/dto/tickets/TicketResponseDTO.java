package com.ediflow.backend.dto.tickets;

import com.ediflow.backend.enums.tikets.TicketPriority;
import com.ediflow.backend.enums.tikets.TicketStatus;
import com.ediflow.backend.enums.tikets.TicketType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TicketResponseDTO {
    private Long id;
    private String title;
    private String description;
    private TicketStatus status;
    private TicketType type;
    private TicketPriority priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdByName;
    private Long buildingId;
}
