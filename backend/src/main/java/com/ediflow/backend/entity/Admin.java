package com.ediflow.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "admin")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    private Long id;

    @Column(name = "trial_start")
    private LocalDate trialStart;

    @Column(name = "trial_end")
    private LocalDate trialEnd;

    @Column
    private String plan;

    @Column(name = "plan_duration")
    private String planDuration;

    @Column(name = "units_paid")
    private Integer unitsPaid;

    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @ToString.Exclude
    private List<Building> buildings = new ArrayList<>();

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    private User user;

    // ⚡ Token de prueba (sandbox) de MercadoPago
    @Column(name = "mp_token_sandbox")
    private String mpTokenSandbox;

    // ⚡ Token de producción (opcional, cuando pases a producción)
    private String mpTokenProd;

    @Column(name = "mp_access_token")
    private String mpAccessToken;

    @Column(name = "mp_refresh_token")
    private String mpRefreshToken;

    @Column(name = "mp_account_id")
    private String mpAccountId;

    @Column(name = "mp_verified")
    private Boolean mpVerified = false;



}
