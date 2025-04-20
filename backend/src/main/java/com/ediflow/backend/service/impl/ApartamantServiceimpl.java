package com.ediflow.backend.service.impl;

import com.ediflow.backend.service.IApartamentService;
import model.Apartament;
import org.springframework.beans.factory.annotation.Autowired;
import repository.IApartamentRepository;

import java.util.List;
import java.util.Optional;

public class ApartamantServiceimpl implements IApartamentService {

    private IApartamentRepository apartamentRepository;
    @Autowired
    public ApartamantServiceimpl(IApartamentRepository apartamentRepository) {
        this.apartamentRepository = apartamentRepository;
    }

    @Override
    public Apartament save(Apartament apartament) {
        return apartamentRepository.save(apartament);
    }

    @Override
    public Optional<Apartament> findById(Long id) {
        return apartamentRepository.findById(id);
    }

    @Override
    public void update(Apartament apartament) {
        apartamentRepository.save(apartament);
    }

    @Override
    public void delete(Long id) {
        apartamentRepository.deleteById(id);
    }

    @Override
    public List<Apartament> findAll() {
        return apartamentRepository.findAll();
    }
}
