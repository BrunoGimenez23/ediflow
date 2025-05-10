package com.ediflow.backend.service.impl;

import com.ediflow.backend.service.IApartmentService;
import com.ediflow.backend.entity.Apartment;
import org.springframework.beans.factory.annotation.Autowired;
import com.ediflow.backend.repository.IApartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class ApartamantServiceimpl implements IApartmentService {

    private IApartmentRepository apartamentRepository;
    @Autowired
    public ApartamantServiceimpl(IApartmentRepository apartamentRepository) {
        this.apartamentRepository = apartamentRepository;
    }

    @Override
    public Apartment save(Apartment apartment) {
        return apartamentRepository.save(apartment);
    }

    @Override
    public Optional<Apartment> findById(Long id) {
        return apartamentRepository.findById(id);
    }

    @Override
    public void update(Apartment apartment) {
        apartamentRepository.save(apartment);
    }

    @Override
    public void delete(Long id) {
        apartamentRepository.deleteById(id);
    }

    @Override
    public List<Apartment> findAll() {
        return apartamentRepository.findAll();
    }
}
