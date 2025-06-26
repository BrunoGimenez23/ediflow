package com.ediflow.backend.entity;

import com.ediflow.backend.enums.ReservationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "common_area_reservation")
public class CommonAreaReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_id")
    private Resident resident;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "common_area_id")
    private CommonArea commonArea;

    private LocalDate reservationDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status;
}
