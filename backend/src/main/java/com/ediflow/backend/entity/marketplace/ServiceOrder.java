package com.ediflow.backend.entity.marketplace;

import com.ediflow.backend.enums.marketplace.OrderStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "service_orders")
public class ServiceOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long buildingId;
    private Long adminId;
    private Long providerId;

    private String category;
    private String description;

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.REQUESTED;

    private Double totalAmount;
    private boolean paid = false;

    private LocalDateTime preferredDate;
    private LocalDateTime createdAt = LocalDateTime.now();
}
