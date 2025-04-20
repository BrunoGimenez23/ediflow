package com.ediflow.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Residents")
public class Resident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resident_id")
    private Long id;

    @Column
    private String name;

    @Column
    private String email;

    @Column
    private Integer phone;

    @Column
    private Integer ci;

    @Column
    private String username;

    @Column
    private String password;

    @OneToOne(mappedBy = "resident")
    private Apartament apartament;

    @OneToMany(mappedBy = "resident", cascade = CascadeType.ALL)
    private List<Payment> payment;

}
