package com.ediflow.backend.controller;

import com.ediflow.backend.dto.payment.PaymentByBuildingDTO;
import com.ediflow.backend.dto.payment.PaymentDTO;
import com.ediflow.backend.entity.Payment;
import com.ediflow.backend.entity.Resident;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.service.IAdminService;
import com.ediflow.backend.service.IPaymentService;
import com.ediflow.backend.service.IUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private IPaymentService paymentService;

    @Autowired
    private IUserService userService;

    @Autowired
    private IAdminService adminService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<String> createPayment(@RequestBody PaymentDTO newPayment) {
        return paymentService.createPayment(newPayment);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updatePayment(@PathVariable Long id, @RequestBody PaymentDTO paymentDTO) {
        return paymentService.updatePayment(id, paymentDTO);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<PaymentDTO>> findAll() {
        List<PaymentDTO> payments = paymentService.findAll();
        return new ResponseEntity<>(payments, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ADMIN','RESIDENT')")
    @GetMapping("/by-building/{id}")
    public ResponseEntity<List<PaymentByBuildingDTO>> paymentByBuilding(@PathVariable Long id) {
        return paymentService.paymentByBuilding(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePayment(@PathVariable Long id) {
        return paymentService.deletePayment(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN','RESIDENT')")
    @GetMapping("/{id}")
    public ResponseEntity<PaymentDTO> getPaymentById(@PathVariable Long id, @RequestParam Long userId) {

        Optional<Payment> optionalPayment = paymentService.findById(id);
        if (optionalPayment.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Payment payment = optionalPayment.get();

        Optional<User> optionalUser = userService.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        User user = optionalUser.get();
        boolean isAdmin = adminService.existsByUserId(userId);

        Resident resident = payment.getResident();
        boolean isOwner = resident.getUser().getId().equals(userId);

        if (!isAdmin && !isOwner) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setAmount(payment.getAmount());
        dto.setConcept(payment.getConcept());
        dto.setStatus(payment.getStatus());
        dto.setIssueDate(payment.getIssueDate());
        dto.setDueDate(payment.getDueDate());
        dto.setPaymentDate(payment.getPaymentDate());

        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasAnyRole('ADMIN','RESIDENT')")
    @GetMapping("/by-resident/{residentId}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByResident(@PathVariable Long residentId) {
        List<PaymentDTO> payments = paymentService.findPaymentsByResidentId(residentId);
        return ResponseEntity.ok(payments);
    }
}
