package com.ediflow.backend.repository;

import com.ediflow.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IUserRepository extends JpaRepository<User, Long> {
}
