package com.ediflow.backend.repository;

import com.ediflow.backend.entity.AdminAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IAdminAccountRepository extends JpaRepository<AdminAccount, Long> {
}
