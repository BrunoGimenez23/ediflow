package com.ediflow.backend.repository;

import com.ediflow.backend.entity.Admin;
import com.ediflow.backend.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IAdminRepository extends JpaRepository<Admin, Long> {

    boolean existsByUserId(Long userId);
    Optional<Admin> findByUserId(Long userId);
    Optional<Admin> findByUserEmail(String email);
    Optional<Admin> findByUser_Username(String username);
    Optional<Admin> findByUser_AdminAccount_Id(Long adminAccountId);
    Optional<Admin> findByUserIdAndUser_AdminAccount_Id(Long userId, Long adminAccountId);
    Optional<Admin> findByUser_AdminAccount_IdAndUser_Role(Long adminAccountId, Role role);

}
