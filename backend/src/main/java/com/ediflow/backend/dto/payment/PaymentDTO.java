package com.ediflow.backend.dto.payment;

import com.ediflow.backend.dto.resident.ResidentDTO;
import com.ediflow.backend.enums.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDTO {
    private Long id;
    private BigDecimal amount;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate issueDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dueDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate paymentDate;

    private String concept;
    private PaymentStatus status;
    private ResidentDTO residentDTO;
    private List<PaymentDTO> payment;
}
