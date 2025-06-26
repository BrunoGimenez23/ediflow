package com.ediflow.backend.repository;


import com.ediflow.backend.entity.Building;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface IBuildingRepository extends JpaRepository<Building, Long> {
    List<Building> findByAdminId(Long adminId);


}
