package com.ediflow.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@NoArgsConstructor
@AllArgsConstructor
@Data
@Table
@Entity
public class Apartment {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "apartament_id")
    private Long id;

    @Column
    private Integer number;

    @Column
    private Integer floor;

    @ManyToOne
    @JoinColumn(name = "building_id", nullable = false)
    private Building building;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "resident_id")
    private Resident resident;
}
