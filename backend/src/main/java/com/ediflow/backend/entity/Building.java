package com.ediflow.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;


@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table
public class Building {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Building_id")
    private Long id;

    @Column
    private String name;

    @Column
    private String address;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    @JsonBackReference
    private Admin admin;

    @OneToMany(mappedBy = "building", cascade = CascadeType.ALL)
    private List<Apartment> apartments;

}
