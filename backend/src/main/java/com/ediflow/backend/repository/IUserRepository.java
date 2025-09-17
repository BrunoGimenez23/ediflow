package com.ediflow.backend.repository;

import com.ediflow.backend.entity.Payment;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IUserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    List<User> findByAdminAccountId(Long adminAccountId);
    List<User> findByBuildingIdAndRole(Long buildingId, Role role);


}
