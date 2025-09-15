package com.ediflow.backend.service.impl;

import com.ediflow.backend.dto.apartment.ApartmentDTO;
import com.ediflow.backend.dto.building.BuildingDTO;
import com.ediflow.backend.dto.payment.PaymentByBuildingDTO;
import com.ediflow.backend.dto.payment.PaymentDTO;
import com.ediflow.backend.dto.payment.PaymentReportDTO;
import com.ediflow.backend.dto.resident.ResidentDTO;
import com.ediflow.backend.dto.resident.ResidentUsernameDTO;
import com.ediflow.backend.dto.user.UserDTO;
import com.ediflow.backend.entity.*;
import com.ediflow.backend.enums.PaymentStatus;
import com.ediflow.backend.repository.IPaymentRepository;
import com.ediflow.backend.repository.IResidentRepository;
import com.ediflow.backend.repository.IUserRepository;
import com.ediflow.backend.service.IAdminService;
import com.ediflow.backend.service.IPaymentService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PaymentServiceImpl implements IPaymentService {
    private final IPaymentRepository paymentRepository;
    private final IResidentRepository residentRepository;
    private final IAdminService adminService;

    private final IUserRepository userRepository;

    public PaymentServiceImpl(IPaymentRepository paymentRepository,
                              IResidentRepository residentRepository,
                              IAdminService adminService, IUserRepository userRepository) {
        this.paymentRepository = paymentRepository;
        this.residentRepository = residentRepository;
        this.adminService = adminService;
        this.userRepository = userRepository;
    }

    @Override
    public ResponseEntity<String> createPayment(PaymentDTO newPayment, String username) {
        if (newPayment.getResidentDTO() == null || newPayment.getResidentDTO().getId() == null) {
            return new ResponseEntity<>("Residente no encontrado", HttpStatus.BAD_REQUEST);
        }

        Optional<Resident> residentOpt = residentRepository.findById(newPayment.getResidentDTO().getId());
        if (residentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Residente no encontrado");
        }

        Resident resident = residentOpt.get();

        User loggedUser = userRepository.findByEmail(username).orElse(null);
        if (loggedUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado");
        }


        if (loggedUser.getAdminAccount() != null) {

            Long adminAccountId = loggedUser.getAdminAccount().getId();
            if (resident.getUser() == null || resident.getUser().getAdminAccount() == null
                    || !resident.getUser().getAdminAccount().getId().equals(adminAccountId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tienes permiso para crear pago para este residente");
            }
        } else {

            Long adminId = loggedUser.getAdmin() != null ? loggedUser.getAdmin().getId() : null;
            if (adminId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado");
            }
            if (resident.getApartment() == null || resident.getApartment().getBuilding() == null
                    || resident.getApartment().getBuilding().getAdmin() == null
                    || !resident.getApartment().getBuilding().getAdmin().getId().equals(adminId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No tienes permiso para crear pago para este residente");
            }
        }

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
        User loggedUser = adminService.getLoggedUser();
        if (loggedUser == null) return new ArrayList<>();

        List<Payment> payments;

        if (loggedUser.getAdminAccount() != null) {
            // Admin con plan Premium Plus (filtrar por AdminAccount)
            Long adminAccountId = loggedUser.getAdminAccount().getId();
            payments = paymentRepository.findByResident_User_AdminAccount_Id(adminAccountId);
        } else {
            // Admin sin AdminAccount (filtrar por adminId)
            Long adminId = adminService.getLoggedAdminId();
            if (adminId == null) return new ArrayList<>();
            payments = paymentRepository.findByResident_Apartment_Building_Admin_Id(adminId);
        }

        return payments.stream()
                .map(this::convertToDTOWithResident)
                .collect(Collectors.toList());
    }

    private PaymentDTO convertToDTOWithResident(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setAmount(payment.getAmount());
        dto.setIssueDate(payment.getIssueDate());
        dto.setDueDate(payment.getDueDate());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setConcept(payment.getConcept());
        dto.setStatus(payment.getStatus());

        if (payment.getResident() != null) {
            Resident resident = payment.getResident();
            ResidentDTO residentDTO = new ResidentDTO();
            residentDTO.setId(resident.getId());
            residentDTO.setCi(resident.getCi());

            if (resident.getUser() != null) {
                User user = resident.getUser();
                UserDTO userDTO = UserDTO.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .fullName(user.getFullName())
                        .build();
                residentDTO.setUserDTO(userDTO);
            }

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
                    apartmentDTO.setBuildingDTO(buildingDTO);
                }

                residentDTO.setApartmentDTO(apartmentDTO);
            }

            dto.setResidentDTO(residentDTO);
        }

        return dto;
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

    @Override
    public Page<PaymentDTO> findAllPaginated(Long buildingId, String status, LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        System.out.println("=== findAllPaginated ===");

        User user = adminService.getLoggedUser();
        if (user == null) {
            System.out.println("No hay usuario logueado. Retornando página vacía.");
            return Page.empty();
        }

        System.out.println("Usuario logueado: " + user.getUsername());
        System.out.println("AdminAccountId: " + (user.getAdminAccount() != null ? user.getAdminAccount().getId() : "null"));
        System.out.println("Role: " + user.getRole());
        System.out.println("Filtros -> buildingId: " + buildingId + ", status: " + status + ", fromDate: " + fromDate + ", toDate: " + toDate);
        System.out.println("Pageable -> page: " + pageable.getPageNumber() + ", size: " + pageable.getPageSize() + ", sort: " + pageable.getSort());

        Specification<Payment> spec = Specification.where(null);

        if (user.getAdminAccount() != null) {
            Long adminAccountId = user.getAdminAccount().getId();
            System.out.println("Filtrando por AdminAccountId: " + adminAccountId);
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("resident").get("user").get("adminAccount").get("id"), adminAccountId)
            );
        } else {
            Long adminId = adminService.getLoggedAdminId();
            System.out.println("Filtrando por AdminId: " + adminId);
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("resident").get("apartment").get("building").get("admin").get("id"), adminId)
            );
        }

        if (buildingId != null) {
            System.out.println("Aplicando filtro de buildingId: " + buildingId);
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("resident").get("apartment").get("building").get("id"), buildingId)
            );
        }

        if (status != null && !status.isBlank()) {
            System.out.println("Aplicando filtro de estado: " + status);
            switch (status.toUpperCase()) {
                case "OVERDUE":
                    LocalDate today = LocalDate.now();
                    spec = spec.and((root, query, cb) -> cb.and(
                            cb.lessThan(root.get("dueDate"), today),
                            cb.notEqual(root.get("status"), PaymentStatus.PAID),
                            cb.notEqual(root.get("status"), PaymentStatus.CANCELLED)
                    ));
                    break;
                case "PENDING":
                    today = LocalDate.now();
                    spec = spec.and((root, query, cb) -> cb.and(
                            cb.equal(root.get("status"), PaymentStatus.PENDING),
                            cb.or(
                                    cb.greaterThanOrEqualTo(root.get("dueDate"), today),
                                    cb.isNull(root.get("dueDate"))
                            )
                    ));
                    break;
                default:
                    spec = spec.and((root, query, cb) ->
                            cb.equal(root.get("status"), PaymentStatus.valueOf(status.toUpperCase()))
                    );
                    break;
            }
        } else {
            System.out.println("No se aplicó filtro de estado por estar vacío o nulo");
        }

        if (fromDate != null && toDate != null) {
            System.out.println("Aplicando filtro entre fechas: " + fromDate + " y " + toDate);
            spec = spec.and((root, query, cb) ->
                    cb.between(root.get("issueDate"), fromDate, toDate)
            );
        } else if (fromDate != null) {
            System.out.println("Aplicando filtro desde fecha: " + fromDate);
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("issueDate"), fromDate)
            );
        } else if (toDate != null) {
            System.out.println("Aplicando filtro hasta fecha: " + toDate);
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("issueDate"), toDate)
            );
        }

        Page<Payment> page = paymentRepository.findAll(spec, pageable);

        System.out.println("Pagos encontrados: " + page.getTotalElements());
        System.out.println("Total páginas: " + page.getTotalPages());

        return page.map(this::convertToDTOWithResident);
    }



    private PaymentDTO mapToDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setAmount(payment.getAmount());
        dto.setConcept(payment.getConcept());
        dto.setIssueDate(payment.getIssueDate());
        dto.setDueDate(payment.getDueDate());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setStatus(payment.getStatus());
        return dto;
    }

    public List<PaymentReportDTO> getPaymentReport(Long buildingId, LocalDate fromDate, LocalDate toDate) {
        List<Payment> payments = paymentRepository.findByBuildingAndDateRange(buildingId, fromDate, toDate);

        return payments.stream()
                .map(payment -> {
                    PaymentReportDTO dto = new PaymentReportDTO();
                    dto.setResidentName(payment.getResident().getUser().getFullName());
                    dto.setApartmentNumber(payment.getResident().getApartment().getNumber());
                    dto.setBuildingName(payment.getResident().getApartment().getBuilding().getName());
                    dto.setDueDate(payment.getDueDate());
                    dto.setPaymentDate(payment.getPaymentDate());
                    dto.setStatus(payment.getStatus());
                    dto.setAmount(payment.getAmount());
                    return dto;
                })
                .collect(Collectors.toList());
    }
    public void exportReportToCSV(HttpServletResponse response, Long buildingId, LocalDate fromDate, LocalDate toDate) throws IOException {

        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=report.csv");

        List<PaymentReportDTO> report = getPaymentReport(buildingId, fromDate, toDate);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        java.util.function.Function<PaymentStatus, String> translateStatus = status -> {
            if (status == null) return "";
            return switch (status) {
                case PAID -> "Pagado";
                case PENDING -> "Pendiente";
                case OVERDUE -> "Vencido";
                case CANCELLED -> "Cancelado";
                default -> "Desconocido";
            };
        };

        try (PrintWriter writer = response.getWriter()) {

            writer.println("Residente,Apartamento,Edificio,Fecha Vencimiento,Fecha Pago,Estado,Monto");

            for (PaymentReportDTO dto : report) {
                String residentName = dto.getResidentName() != null ? dto.getResidentName() : "";
                String apartmentNumber = dto.getApartmentNumber() != null ? dto.getApartmentNumber().toString() : "";
                String buildingName = dto.getBuildingName() != null ? dto.getBuildingName() : "";
                String dueDate = dto.getDueDate() != null ? dto.getDueDate().format(formatter) : "";
                String paymentDate = dto.getPaymentDate() != null ? dto.getPaymentDate().format(formatter) : "";
                String status = translateStatus.apply(dto.getStatus());
                String amount = dto.getAmount() != null ? String.format("%.2f", dto.getAmount()) : "";

                writer.printf("%s,%s,%s,%s,%s,%s,%s%n",
                        residentName,
                        apartmentNumber,
                        buildingName,
                        dueDate,
                        paymentDate,
                        status,
                        amount
                );
            }

            writer.flush();
        }
    }
}
