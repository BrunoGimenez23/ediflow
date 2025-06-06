package com.ediflow.backend.repository;

import com.ediflow.backend.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IAdminRepository extends JpaRepository<Admin, Long> {

    boolean existsByUserId(Long userId);

}
