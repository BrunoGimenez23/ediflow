package com.ediflow.backend.service;

import model.Building;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IBuildingService {

    Building save (Building building);
    Optional<Building> findById (Long id);
    void update (Building building);
    void delete (Long id);
    List<Building> findAll();
}
