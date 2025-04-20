package com.ediflow.backend.service;

import model.Apartament;

import java.util.List;
import java.util.Optional;

public interface IApartamentService {

    Apartament save (Apartament apartament);
    Optional<Apartament> findById(Long id);
    void update (Apartament apartament);
    void delete(Long id);
    List<Apartament> findAll();
}
