package model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Apartaments")
@Entity
public class Apartament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "apartament_id")
    private Long id;

    @Column
    private String number;

    @Column
    private Integer floor;

    @ManyToOne
    @JoinColumn(name = "building_id", nullable = false)
    private Building building;
}
