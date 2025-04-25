package com.ediflow.backend.service;

import com.ediflow.backend.entity.Admin;

import java.util.List;
import java.util.Optional;

public interface IAdminService {

    Admin save (Admin admin);
    Optional<Admin> findById (Long id);
    void update (Admin admin);
    void delete (Long id);
    List<Admin> findAll();
}
