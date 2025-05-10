package com.ediflow.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table
public class Resident {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resident_id")
    private Long id;

    @Column
    private Integer phone;

    @Column
    private Long ci;


    @OneToOne(mappedBy = "resident")
    private Apartment apartment;

    @OneToMany(mappedBy = "resident", cascade = CascadeType.ALL)
    private List<Payment> payment;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "user_id")
    private User user;

    public void setBuilding(Building building) {
    }
}
