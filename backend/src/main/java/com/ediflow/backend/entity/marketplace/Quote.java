package com.ediflow.backend.entity.marketplace;

import com.ediflow.backend.enums.marketplace.QuoteStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "quotes")
public class Quote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "provider_id")
    private Long providerId;

    @Column(name = "total", insertable = false, updatable = false)
    private Double total;

    private Double amount;

    private String message;

    @Enumerated(EnumType.STRING)
    private QuoteStatus status = QuoteStatus.SENT;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
