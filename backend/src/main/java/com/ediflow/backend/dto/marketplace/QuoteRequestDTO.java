package com.ediflow.backend.dto.marketplace;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class QuoteRequestDTO {
    @NotNull(message = "El orderId es obligatorio")
    private Long orderId;

    @NotNull(message = "El monto es obligatorio")
    private Double amount;
    private String message;
}
