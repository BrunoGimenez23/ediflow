package com.ediflow.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Builder
@Table(name = "resident")
public class Resident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resident_id")
    private Long id;

    @Column
    private String phone;

    @Column
    private Long ci;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "apartment_id", unique = true)
    private Apartment apartment;

    @OneToMany(mappedBy = "resident", cascade = CascadeType.ALL)
    private List<Payment> payment;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "building_id")
    private Building building;

}
