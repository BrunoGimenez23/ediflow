package com.ediflow.backend.service.impl;

import com.ediflow.backend.dto.apartment.ApartmentDTO;
import com.ediflow.backend.dto.building.BuildingDTO;
import com.ediflow.backend.dto.payment.PaymentByBuildingDTO;
import com.ediflow.backend.dto.payment.PaymentDTO;
import com.ediflow.backend.dto.resident.ResidentDTO;
import com.ediflow.backend.dto.resident.ResidentUsernameDTO;
import com.ediflow.backend.dto.user.UserDTO;
import com.ediflow.backend.entity.*;
import com.ediflow.backend.enums.PaymentStatus;
import com.ediflow.backend.repository.IPaymentRepository;
import com.ediflow.backend.repository.IResidentRepository;
import com.ediflow.backend.service.IAdminService;
import com.ediflow.backend.service.IPaymentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl implements IPaymentService {
    private final IPaymentRepository paymentRepository;
    private final IResidentRepository residentRepository;
    private final IAdminService adminService;

    public PaymentServiceImpl(IPaymentRepository paymentRepository,
                              IResidentRepository residentRepository,
                              IAdminService adminService) {
        this.paymentRepository = paymentRepository;
        this.residentRepository = residentRepository;
        this.adminService = adminService;
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
            payment.setIssueDate(newPayment.getIssueDate());
            payment.setDueDate(newPayment.getDueDate());
            payment.setPaymentDate(newPayment.getPaymentDate());
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
        Long adminId = adminService.getLoggedAdminId();
        if (adminId == null) return new ArrayList<>();

        // Cambié el método por el que sí existe en tu repositorio
        List<Payment> payments = paymentRepository.findByResident_Apartment_Building_Admin_Id(adminId);

        List<PaymentDTO> paymentsDTOS = new ArrayList<>();
        System.out.println("Admin ID: " + adminId);
        System.out.println("Cantidad de pagos encontrados: " + payments.size());

        for (Payment payment : payments) {
            PaymentDTO paymentDTO = new PaymentDTO();

            paymentDTO.setId(payment.getId());
            paymentDTO.setAmount(payment.getAmount());
            paymentDTO.setIssueDate(payment.getIssueDate());
            paymentDTO.setDueDate(payment.getDueDate());
            paymentDTO.setPaymentDate(payment.getPaymentDate());
            paymentDTO.setConcept(payment.getConcept());
            paymentDTO.setStatus(payment.getStatus());

            if (payment.getResident() != null && payment.getResident().getUser() != null) {
                Resident resident = payment.getResident();
                User user = resident.getUser();

                UserDTO userDTO = UserDTO.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .fullName(user.getFullName())
                        .build();

                ResidentDTO residentDTO = new ResidentDTO();
                residentDTO.setId(resident.getId());
                residentDTO.setCi(resident.getCi());
                residentDTO.setUserDTO(userDTO);

                if (resident.getApartment() != null) {
                    Apartment apartment = resident.getApartment();
                    ApartmentDTO apartmentDTO = new ApartmentDTO();
                    apartmentDTO.setId(apartment.getId());
                    apartmentDTO.setNumber(apartment.getNumber());
                    apartmentDTO.setFloor(apartment.getFloor());

                    if (apartment.getBuilding() != null) {
                        Building building = apartment.getBuilding();
                        BuildingDTO buildingDTO = new BuildingDTO();
                        buildingDTO.setId(building.getId());
                        buildingDTO.setName(building.getName());
                        buildingDTO.setAddress(building.getAddress());

                        apartmentDTO.setBuildingDTO(buildingDTO);  // Aquí asignamos el edificio dentro del apartamento
                    }

                    residentDTO.setApartmentDTO(apartmentDTO);
                }

                paymentDTO.setResidentDTO(residentDTO);
            }

            paymentsDTOS.add(paymentDTO);
        }

        return paymentsDTOS;
    }



    @Override
    public ResponseEntity<List<PaymentByBuildingDTO>> paymentByBuilding(Long id) {
        Long adminId = adminService.getLoggedAdminId();
        if (adminId == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<Payment> payments = paymentRepository.findByResident_Apartment_Building_Admin_Id(adminId).stream()
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
            dto.setDate(payment.getIssueDate());
            dto.setStatus(payment.getStatus().name());

            if (payment.getResident() != null && payment.getResident().getUser() != null) {
                User user = payment.getResident().getUser();
                ResidentUsernameDTO residentUsernameDTO = new ResidentUsernameDTO(user.getUsername());
                dto.setResidentDTO(residentUsernameDTO);
            }

            paymentByBuildingDTOS.add(dto);
        }

        return new ResponseEntity<>(paymentByBuildingDTOS, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> updatePayment(Long id, PaymentDTO paymentDTO) {
        Optional<Payment> paymentOpt = paymentRepository.findById(id);
        if (paymentOpt.isEmpty()) {
            return new ResponseEntity<>("Pago no encontrado", HttpStatus.NOT_FOUND);
        }

        Payment payment = paymentOpt.get();

        payment.setAmount(paymentDTO.getAmount());
        payment.setIssueDate(paymentDTO.getIssueDate());
        payment.setDueDate(paymentDTO.getDueDate());
        payment.setPaymentDate(paymentDTO.getPaymentDate());
        payment.setConcept(paymentDTO.getConcept());
        payment.setStatus(paymentDTO.getStatus());

        if (paymentDTO.getResidentDTO() != null && paymentDTO.getResidentDTO().getId() != null) {
            Optional<Resident> residentOpt = residentRepository.findById(paymentDTO.getResidentDTO().getId());
            if (residentOpt.isEmpty()) {
                return new ResponseEntity<>("Residente no encontrado", HttpStatus.BAD_REQUEST);
            }
            payment.setResident(residentOpt.get());
        }

        try {
            paymentRepository.save(payment);
            return new ResponseEntity<>("Pago actualizado con éxito", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al actualizar el pago: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public List<PaymentDTO> findPaymentsByResidentId(Long residentId) {
        List<Payment> payments = paymentRepository.findByResident_Id(residentId);
        return payments.stream()
                .map(this::convertToDTOWithStatus)
                .collect(Collectors.toList());
    }

    private PaymentDTO convertToDTOWithStatus(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setAmount(payment.getAmount());
        dto.setConcept(payment.getConcept());
        dto.setIssueDate(payment.getIssueDate());
        dto.setDueDate(payment.getDueDate());
        dto.setPaymentDate(payment.getPaymentDate());

        // Calcula el estado dinámicamente
        if (payment.getPaymentDate() != null) {
            dto.setStatus(PaymentStatus.PAID);
        } else if (payment.getDueDate() != null && payment.getDueDate().isBefore(LocalDate.now())) {
            dto.setStatus(PaymentStatus.OVERDUE);
        } else {
            dto.setStatus(PaymentStatus.PENDING);
        }

        return dto;
    }

    private PaymentDTO convertToDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setAmount(payment.getAmount());
        dto.setConcept(payment.getConcept());
        dto.setStatus(payment.getStatus());
        dto.setIssueDate(payment.getIssueDate());
        dto.setDueDate(payment.getDueDate());
        dto.setPaymentDate(payment.getPaymentDate());

        return dto;
    }
    public Page<Payment> findPaymentsByFilters(Long adminId, Long buildingId, Pageable pageable) {
        if (buildingId != null) {
            return paymentRepository.findByResident_Apartment_Building_Admin_IdAndResident_Apartment_Building_Id(adminId, buildingId, pageable);
        }
        return paymentRepository.findByResident_Apartment_Building_Admin_Id(adminId, pageable);
    }
}
