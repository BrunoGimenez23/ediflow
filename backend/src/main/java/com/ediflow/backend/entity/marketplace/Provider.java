package com.ediflow.backend.entity.marketplace;

import com.ediflow.backend.entity.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "providers")
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String contactName;
    private String email;
    private String phone;
    private String address;
    private String category;
    private String location;
    private boolean verified = false;

    private Double rating = 0.0;
    private Integer totalReviews = 0;
    private String mpAccessToken;  // token OAuth para cobrar pagos directos
    private String mpRefreshToken; // para renovar el access token
    private String mpAccountId;    // opcional: ID de la cuenta Mercado Pago

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;
}
