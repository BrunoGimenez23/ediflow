package com.ediflow.backend.repository;

import com.ediflow.backend.entity.Resident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IResidentRepository extends JpaRepository<Resident, Long> {


    boolean existsByCi(Long ci);
}
