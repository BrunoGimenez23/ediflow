package com.ediflow.backend.entity;

import com.ediflow.backend.enums.tikets.TicketPriority;
import com.ediflow.backend.enums.tikets.TicketStatus;
import com.ediflow.backend.enums.tikets.TicketType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private TicketStatus status;

    @Enumerated(EnumType.STRING)
    private TicketType type;

    @Enumerated(EnumType.STRING)
    private TicketPriority priority;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy; // Puede ser Resident o Admin

    @ManyToOne
    @JoinColumn(name = "building_id")
    private Building building;
}
