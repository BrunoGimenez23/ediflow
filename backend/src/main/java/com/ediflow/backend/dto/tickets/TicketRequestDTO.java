package com.ediflow.backend.dto.tickets;

import com.ediflow.backend.enums.tikets.TicketPriority;
import com.ediflow.backend.enums.tikets.TicketType;
import lombok.Data;

@Data
public class TicketRequestDTO {
    private String title;
    private String description;
    private TicketType type;         // COMPLAINT o NOTICE
    private TicketPriority priority; // LOW, MEDIUM, HIGH
    private Long buildingId;         // edificio al que pertenece
    private Long createdById;        // usuario que crea el ticket
}
