package com.ediflow.backend.controller;

import com.ediflow.backend.dto.payment.PaymentByBuildingDTO;
import com.ediflow.backend.dto.payment.PaymentDTO;
import com.ediflow.backend.service.IPaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payment")
public class PaymentController {
    @Autowired
    private IPaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<String> createPayment(@RequestBody PaymentDTO newPayment){
        return paymentService.createPayment(newPayment);
    }

    @GetMapping("/all")
    public ResponseEntity<List<PaymentDTO>> findAll() {
        List<PaymentDTO> payments = paymentService.findAll();
        return new ResponseEntity<>(payments, HttpStatus.OK);
    }

    @GetMapping("/by-building/{id}")
    public ResponseEntity<List<PaymentByBuildingDTO>> paymentByBuilding(@PathVariable Long id) {
        return paymentService.paymentByBuilding(id);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePayment(@PathVariable Long id){
        return paymentService.deletePayment(id);
    }

    
}
