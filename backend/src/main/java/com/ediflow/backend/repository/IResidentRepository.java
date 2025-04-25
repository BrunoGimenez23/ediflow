package com.ediflow.backend.repository;

import com.ediflow.backend.entity.Resident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IResidentRepository extends JpaRepository<Resident, Long> {
}
