package com.ediflow.backend.service;

import com.ediflow.backend.dto.admin.AdminDTO;
import com.ediflow.backend.entity.Admin;
import com.ediflow.backend.entity.AdminAccount;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface IAdminService {

    AdminDTO createAdmin (AdminDTO newAdmin);
    Optional<AdminDTO> getAdminById(Long id);
    ResponseEntity<String> updateAdmin (Long id, AdminDTO adminDTO);
    ResponseEntity<String> deleteAdmin (Long id);
    List<AdminDTO> findAll();
    boolean existsByUserId(Long userId);
    Long getLoggedAdminId();
    String getLoggedUserEmail();
    ResponseEntity<String> assignPlan(String email, String planName, String duration);


}
