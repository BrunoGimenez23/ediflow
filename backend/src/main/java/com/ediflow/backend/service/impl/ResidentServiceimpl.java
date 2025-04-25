package com.ediflow.backend.service.impl;

import com.ediflow.backend.entity.Resident;
import com.ediflow.backend.repository.IResidentRepository;
import com.ediflow.backend.service.IResidentService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

public class ResidentServiceimpl implements IResidentService {

    private IResidentRepository residentRepository;

    public ResidentServiceimpl(IResidentRepository residentRepository) {
        this.residentRepository = residentRepository;
    }

    @Autowired


    @Override
    public Resident save(Resident resident) {
        return residentRepository.save(resident);
    }

    @Override
    public Optional<Resident> findById(Long id) {
        return residentRepository.findById(id);
    }

    @Override
    public void update(Resident resident) {
        residentRepository.save(resident);
    }

    @Override
    public void delete(Long id) {
        residentRepository.deleteById(id);
    }

    @Override
    public List<Resident> findAll() {
        return residentRepository.findAll();
    }
}
