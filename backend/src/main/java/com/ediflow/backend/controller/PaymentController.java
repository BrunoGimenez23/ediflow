package com.ediflow.backend.controller;

import com.ediflow.backend.Specifications.PaymentSpecifications;
import com.ediflow.backend.dto.payment.PaymentByBuildingDTO;
import com.ediflow.backend.dto.payment.PaymentDTO;
import com.ediflow.backend.entity.Payment;
import com.ediflow.backend.entity.Resident;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.enums.PaymentStatus;
import com.ediflow.backend.mapper.PaymentMapper;
import com.ediflow.backend.repository.IPaymentRepository;
import com.ediflow.backend.service.IAdminService;
import com.ediflow.backend.service.IPaymentService;
import com.ediflow.backend.service.IUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private IPaymentService paymentService;
    @Autowired
    private IPaymentRepository paymentRepository;

    @Autowired
    private IUserService userService;

    @Autowired
    private IAdminService adminService;

    @Autowired
    private PaymentMapper paymentMapper;

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

    @GetMapping("/all")
    public ResponseEntity<Page<PaymentDTO>> getPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long buildingId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        Specification<Payment> spec = Specification.where(null);

        LocalDate today = LocalDate.now();

        if ("OVERDUE".equalsIgnoreCase(status)) {
            spec = spec.and((root, query, cb) -> cb.and(
                    cb.lessThan(root.get("dueDate"), today),
                    cb.notEqual(root.get("status"), PaymentStatus.PAID),
                    cb.notEqual(root.get("status"), PaymentStatus.CANCELLED)
            ));
        } else if ("PENDING".equalsIgnoreCase(status)) {
            spec = spec.and((root, query, cb) -> cb.and(
                    cb.equal(root.get("status"), PaymentStatus.PENDING),
                    cb.or(
                            cb.greaterThanOrEqualTo(root.get("dueDate"), today),
                            cb.isNull(root.get("dueDate"))
                    )
            ));
        } else if (status != null && !status.isEmpty()) {
            spec = spec.and(PaymentSpecifications.hasStatus(status));
        }
        if (buildingId != null) {
            spec = spec.and(PaymentSpecifications.hasBuildingId(buildingId));
        }
        if (fromDate != null || toDate != null) {
            spec = spec.and(PaymentSpecifications.issueDateBetween(fromDate, toDate));
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<Payment> pagePayments = paymentRepository.findAll(spec, pageable);


        Page<PaymentDTO> dtoPage = pagePayments.map(paymentMapper::toDTO);

        return ResponseEntity.ok(dtoPage);
    }

    @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE','SUPPORT')")
    @GetMapping("/by-building/{id}")
    public ResponseEntity<List<PaymentByBuildingDTO>> paymentByBuilding(@PathVariable Long id) {
        return paymentService.paymentByBuilding(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePayment(@PathVariable Long id) {
        return paymentService.deletePayment(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN','RESIDENT','EMPLOYEE','SUPPORT')")
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
        boolean isEmployee = user.getRole().name().equals("EMPLOYEE");
        boolean isSupport = user.getRole().name().equals("SUPPORT");

        Resident resident = payment.getResident();
        boolean isOwner = resident.getUser().getId().equals(userId);

        if (!(isAdmin || isEmployee || isSupport || isOwner)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        PaymentDTO dto = paymentMapper.toDTO(payment);
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasAnyRole('ADMIN','RESIDENT', 'SUPPORT')")
    @GetMapping("/by-resident/{residentId}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsByResident(@PathVariable Long residentId) {
        List<PaymentDTO> payments = paymentService.findPaymentsByResidentId(residentId);
        return ResponseEntity.ok(payments);
    }
}
