package com.ediflow.backend.repository;

import com.ediflow.backend.entity.Apartment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IApartmentRepository extends JpaRepository<Apartment, Long> {
    List<Apartment> findByBuildingId(Long id);
}
