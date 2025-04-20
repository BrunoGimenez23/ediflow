package com.ediflow.backend.service.impl;

import com.ediflow.backend.service.IAdminService;
import model.Admin;
import org.springframework.beans.factory.annotation.Autowired;
import repository.IAdminRepository;

import java.util.List;
import java.util.Optional;

public class AdminServiceimpl implements IAdminService {

    private IAdminRepository adminRepository;

    @Autowired
    public AdminServiceimpl(IAdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public Admin save(Admin admin) {
        return adminRepository.save(admin);
    }

    @Override
    public Optional<Admin> findById(Long id) {
        return adminRepository.findById(id);
    }

    @Override
    public void update(Admin admin) {
        adminRepository.save(admin);
    }

    @Override
    public void delete(Long id) {
        adminRepository.deleteById(id);
    }

    @Override
    public List<Admin> findAll() {
        return adminRepository.findAll();
    }
}
