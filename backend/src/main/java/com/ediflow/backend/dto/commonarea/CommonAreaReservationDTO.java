package com.ediflow.backend.dto.commonarea;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommonAreaReservationDTO {
    private Long id;
    private Long residentId;
    private Long commonAreaId;
    private String commonAreaName;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String residentFullName;
}
