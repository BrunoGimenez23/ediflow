package com.ediflow.backend.repository;

import com.ediflow.backend.entity.InvitationCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InvitationCodeRepository extends JpaRepository<InvitationCode, Long> {
    Optional<InvitationCode> findByCode(String code);
}