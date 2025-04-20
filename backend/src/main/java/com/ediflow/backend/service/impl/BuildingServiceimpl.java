package com.ediflow.backend.service.impl;

import com.ediflow.backend.service.IBuildingService;
import com.ediflow.backend.model.Building;
import org.springframework.beans.factory.annotation.Autowired;
import com.ediflow.backend.repository.IBuildingRepository;

import java.util.List;
import java.util.Optional;

public class BuildingServiceimpl implements IBuildingService {

    private IBuildingRepository buildingRepository;
    @Autowired
    public BuildingServiceimpl(IBuildingRepository buildingRepository) {
        this.buildingRepository = buildingRepository;
    }

    @Override
    public Building save(Building building) {
        return buildingRepository.save(building);
    }

    @Override
    public Optional<Building> findById(Long id) {
        return buildingRepository.findById(id);
    }

    @Override
    public void update(Building building) {
        buildingRepository.save(building);
    }

    @Override
    public void delete(Long id) {
        buildingRepository.deleteById(id);
    }

    @Override
    public List<Building> findAll() {
        return buildingRepository.findAll();
    }
}
