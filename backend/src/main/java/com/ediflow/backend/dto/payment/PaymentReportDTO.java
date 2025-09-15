package com.ediflow.backend.dto.payment;

import com.ediflow.backend.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentReportDTO {
    private String residentName;
    private Integer apartmentNumber;
    private String buildingName;
    private LocalDate dueDate;
    private LocalDate paymentDate;
    private PaymentStatus status;
    private BigDecimal amount;
}
