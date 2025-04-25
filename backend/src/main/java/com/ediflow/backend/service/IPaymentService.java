package com.ediflow.backend.service;

import com.ediflow.backend.entity.Payment;

import java.util.List;
import java.util.Optional;

public interface IPaymentService {

    Payment save (Payment payment);
    Optional<Payment> findById (Long id);

    void update (Payment payment);
    void delete (Long id);
    List<Payment> findAll();
}
