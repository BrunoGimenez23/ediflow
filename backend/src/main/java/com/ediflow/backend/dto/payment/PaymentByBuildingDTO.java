package com.ediflow.backend.dto.payment;

import com.ediflow.backend.dto.resident.ResidentUsernameDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentByBuildingDTO {
    private Long id;
    private BigDecimal amount;
    private LocalDate date;
    private String status;
    private ResidentUsernameDTO residentDTO;
}
