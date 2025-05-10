package com.ediflow.backend.service;

import com.ediflow.backend.entity.Apartment;

import java.util.List;
import java.util.Optional;

public interface IApartmentService {

    Apartment save (Apartment apartment);
    Optional<Apartment> findById(Long id);
    void update (Apartment apartment);
    void delete(Long id);
    List<Apartment> findAll();
}
