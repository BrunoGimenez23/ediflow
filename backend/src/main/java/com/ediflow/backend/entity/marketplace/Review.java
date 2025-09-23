package com.ediflow.backend.entity.marketplace;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;
    private Long adminId;
    private Long providerId;

    private Integer rating;
    private String comment;

    private LocalDateTime createdAt = LocalDateTime.now();
}

