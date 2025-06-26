package com.ediflow.backend.service;

import com.ediflow.backend.dto.payment.PaymentByBuildingDTO;
import com.ediflow.backend.dto.payment.PaymentDTO;
import com.ediflow.backend.entity.Payment;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

public interface IPaymentService {

    ResponseEntity<String> createPayment(PaymentDTO newPayment);
    Optional<Payment> findById (Long id);

    void update (Payment payment);
    ResponseEntity<String> deletePayment(Long id);
    List<PaymentDTO> findAll();

    ResponseEntity<List<PaymentByBuildingDTO>> paymentByBuilding(Long id);

    ResponseEntity<String> updatePayment(Long id, PaymentDTO paymentDTO);

    List<PaymentDTO> findPaymentsByResidentId(Long residentId);
}
