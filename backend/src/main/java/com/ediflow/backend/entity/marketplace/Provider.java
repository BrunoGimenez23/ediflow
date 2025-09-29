package com.ediflow.backend.entity.marketplace;

import com.ediflow.backend.entity.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
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

    // 🔹 Tokens para pagos directos
    private String mpAccessToken;  // token OAuth para cobrar pagos directos
    private String mpRefreshToken; // token para renovar el access token automáticamente
    private String mpAccountId;    // opcional: ID de la cuenta Mercado Pago

    // 🔹 Opcional para registro dinámico de proveedores vía OAuth
    private String clientId;       // clientId de la app Mercado Pago del proveedor
    private String clientSecret;   // clientSecret de la app Mercado Pago del proveedor

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;
}
