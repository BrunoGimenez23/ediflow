package com.ediflow.backend.service;

import com.ediflow.backend.model.Resident;

import java.util.List;
import java.util.Optional;

public interface IResidentService {
    Resident save (Resident resident);

    Optional<Resident> findById (Long id);

    void update (Resident resident);

    void delete (Long id);

    List<Resident> findAll();

}
