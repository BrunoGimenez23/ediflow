package com.ediflow.backend.repository;

import com.ediflow.backend.model.Building;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IBuildingRepository extends JpaRepository<Building, Long> {
}
