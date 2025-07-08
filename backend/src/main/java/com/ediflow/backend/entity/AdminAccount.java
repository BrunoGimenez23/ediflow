package com.ediflow.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "admin_account")
public class AdminAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;

    private boolean active;

    private LocalDate subscriptionStart;
    private LocalDate subscriptionEnd;
    @Column(nullable = false)
    private String plan;

    @OneToMany(mappedBy = "adminAccount", cascade = CascadeType.ALL)
    private List<User> users;
}
