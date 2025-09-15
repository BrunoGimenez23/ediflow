package com.ediflow.backend.service;

import com.ediflow.backend.dto.payment.PaymentByBuildingDTO;
import com.ediflow.backend.dto.payment.PaymentDTO;
import com.ediflow.backend.dto.payment.PaymentReportDTO;
import com.ediflow.backend.entity.Payment;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IPaymentService {

    ResponseEntity<String> createPayment(PaymentDTO newPayment, String username);
    Optional<Payment> findById (Long id);

    void update (Payment payment);
    ResponseEntity<String> deletePayment(Long id);
    List<PaymentDTO> findAll();

    ResponseEntity<List<PaymentByBuildingDTO>> paymentByBuilding(Long id);

    ResponseEntity<String> updatePayment(Long id, PaymentDTO paymentDTO);

    List<PaymentDTO> findPaymentsByResidentId(Long residentId);
    Page<PaymentDTO> findAllPaginated(Long buildingId, String status, LocalDate fromDate, LocalDate toDate, Pageable pageable);
    List<PaymentReportDTO> getPaymentReport(Long buildingId, LocalDate fromDate, LocalDate toDate);
    void exportReportToCSV(HttpServletResponse response, Long buildingId, LocalDate fromDate, LocalDate toDate) throws IOException;
}
