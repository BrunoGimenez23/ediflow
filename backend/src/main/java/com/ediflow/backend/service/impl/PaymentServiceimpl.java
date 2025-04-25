package com.ediflow.backend.service.impl;

import com.ediflow.backend.entity.Payment;
import com.ediflow.backend.repository.IPaymentRepository;
import com.ediflow.backend.service.IPaymentService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

public class PaymentServiceimpl implements IPaymentService {

    private IPaymentRepository paymentRepository;
    @Autowired
    public PaymentServiceimpl(IPaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public Payment save(Payment payment) {
        return paymentRepository.save(payment);
    }

    @Override
    public Optional<Payment> findById(Long id) {
        return paymentRepository.findById(id);
    }

    @Override
    public void update(Payment payment) {
        paymentRepository.save(payment);
    }

    @Override
    public void delete(Long id) {
        paymentRepository.deleteById(id);
    }

    @Override
    public List<Payment> findAll() {
        return paymentRepository.findAll();
    }
}
