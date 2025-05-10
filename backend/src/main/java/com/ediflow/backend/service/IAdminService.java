package com.ediflow.backend.service;

import com.ediflow.backend.dto.admin.AdminDTO;
import com.ediflow.backend.entity.Admin;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface IAdminService {

    ResponseEntity<String> createAdmin (AdminDTO newAdmin);
    Optional<Admin> findById (Long id);
    ResponseEntity<String> updateAdmin (Long id, AdminDTO adminDTO);
    ResponseEntity<String> deleteAdmin (Long id);
    List<AdminDTO> findAll();
}
