package com.ediflow.backend.service.impl;

import com.ediflow.backend.dto.payment.PaymentByBuildingDTO;
import com.ediflow.backend.dto.payment.PaymentDTO;
import com.ediflow.backend.dto.resident.ResidentDTO;
import com.ediflow.backend.dto.resident.ResidentUsernameDTO;
import com.ediflow.backend.dto.user.UserDTO;
import com.ediflow.backend.entity.Payment;
import com.ediflow.backend.entity.Resident;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.repository.IPaymentRepository;
import com.ediflow.backend.repository.IResidentRepository;
import com.ediflow.backend.service.IPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
@Service
public class PaymentServiceimpl implements IPaymentService {
    @Autowired
    private IPaymentRepository paymentRepository;
    @Autowired
    private IResidentRepository residentRepository;

    public PaymentServiceimpl(IPaymentRepository paymentRepository, IResidentRepository residentRepository) {
        this.paymentRepository = paymentRepository;
        this.residentRepository = residentRepository;
    }

    @Override
    public ResponseEntity<String> createPayment(PaymentDTO newPayment) {
        if (newPayment.getResidentDTO() == null || newPayment.getResidentDTO().getId() == null) {
            return new ResponseEntity<>("Residente no encontrado", HttpStatus.BAD_REQUEST);
        }

        Optional<Resident> residentOpt = residentRepository.findById(newPayment.getResidentDTO().getId());
        if (residentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Residente no encontrado");
        }

        Resident resident = residentOpt.get();

        try {
            Payment payment = new Payment();
            payment.setId(newPayment.getId());
            payment.setAmount(newPayment.getAmount());
            payment.setDate(newPayment.getDate());
            payment.setConcept(newPayment.getConcept());
            payment.setStatus(newPayment.getStatus());

            payment.setResident(resident);

            paymentRepository.save(payment);
            return new ResponseEntity<>("Pago creado con éxito", HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>("Error al crear el pago: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
    public ResponseEntity<String> deletePayment(Long id) {
        boolean paymentExist = paymentRepository.findById(id).isPresent();

        if (paymentExist) {
            paymentRepository.deleteById(id);
            return ResponseEntity.ok("Pago eliminado correctamente");
        }

        return new ResponseEntity<>("Pago no encontrado", HttpStatus.BAD_REQUEST);
    }

    @Override
    public List<PaymentDTO> findAll() {
        List<Payment> payments = paymentRepository.findAll();
        List<PaymentDTO> paymentsDTOS = new ArrayList<>();

        for (Payment payment : payments) {
            PaymentDTO paymentDTO = new PaymentDTO();

            paymentDTO.setId(payment.getId());
            paymentDTO.setAmount(payment.getAmount());
            paymentDTO.setDate(payment.getDate());
            paymentDTO.setConcept(payment.getConcept());
            paymentDTO.setStatus(payment.getStatus());

            // Si hay un residente asociado, mapear sus datos
            if (payment.getResident() != null && payment.getResident().getUser() != null) {
                Resident resident = payment.getResident();
                User user = resident.getUser();

                UserDTO userDTO = new UserDTO(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole()
                );

                ResidentDTO residentDTO = new ResidentDTO();
                residentDTO.setId(resident.getId());
                residentDTO.setCi(resident.getCi());
                residentDTO.setUserDTO(userDTO);

                paymentDTO.setResidentDTO(residentDTO);
            }

            paymentsDTOS.add(paymentDTO);
        }

        return paymentsDTOS;
    }

    @Override
    public ResponseEntity<List<PaymentByBuildingDTO>> paymentByBuilding(Long id) {
        {
            List<Payment> payments = paymentRepository.findAll().stream()
                    .filter(payment -> payment.getResident() != null &&
                            payment.getResident().getApartment() != null &&
                            payment.getResident().getApartment().getBuilding() != null &&
                            payment.getResident().getApartment().getBuilding().getId().equals(id))
                    .toList();

            List<PaymentByBuildingDTO> paymentByBuildingDTOS = new ArrayList<>();

            for (Payment payment : payments) {
                PaymentByBuildingDTO dto = new PaymentByBuildingDTO();

                dto.setId(payment.getId());
                dto.setAmount(payment.getAmount());
                dto.setDate(payment.getDate());
                dto.setStatus(payment.getStatus().name());  // Convert enum a String

                if (payment.getResident() != null && payment.getResident().getUser() != null) {
                    User user = payment.getResident().getUser();
                    ResidentUsernameDTO residentUsernameDTO = new ResidentUsernameDTO(user.getUsername());
                    dto.setResidentDTO(residentUsernameDTO);
                }

                paymentByBuildingDTOS.add(dto);
            }

            return new ResponseEntity<>(paymentByBuildingDTOS, HttpStatus.OK);
        }
    }
}
