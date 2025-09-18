package com.ediflow.backend.service.impl;

import com.ediflow.backend.dto.building.BuildingDTO;
import com.ediflow.backend.dto.admin.AdminDTO;
import com.ediflow.backend.dto.building.BuildingDetailDTO;
import com.ediflow.backend.dto.building.BuildingSummaryDTO;
import com.ediflow.backend.dto.user.UserDTO;
import com.ediflow.backend.entity.Admin;
import com.ediflow.backend.entity.AdminAccount;
import com.ediflow.backend.entity.Building;
import com.ediflow.backend.enums.Role;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.exception.ResourceNotFoundException;
import com.ediflow.backend.repository.IAdminAccountRepository;
import com.ediflow.backend.repository.IAdminRepository;
import com.ediflow.backend.repository.IUserRepository;
import com.ediflow.backend.service.IAdminService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminServiceimpl implements IAdminService {

    private final IAdminRepository adminRepository;

    private final IUserRepository userRepository;

    private final IAdminAccountRepository adminAccountRepository;


    @Autowired
    public AdminServiceimpl(IAdminRepository adminRepository, IUserRepository userRepository, IAdminAccountRepository adminAccountRepository) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.adminAccountRepository = adminAccountRepository;
    }

    private Integer calculateTrialDaysLeft(Admin admin) {
        LocalDate today = LocalDate.now();

        if (admin.getTrialEnd() == null) {
            return null;
        }

        if (admin.getTrialEnd().isBefore(today)) {
            return 0;
        }

        return (int) ChronoUnit.DAYS.between(today, admin.getTrialEnd());
    }

    public Long getLoggedAdminId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetails) {
            String email = ((UserDetails) principal).getUsername();

            return adminRepository.findByUserEmail(email)
                    .map(Admin::getId)
                    .orElse(null);
        }

        return null;
    }

    public String getLoggedUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) return null;

        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        }

        return null;
    }

    @Override
    public User getLoggedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String email;
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername(); // acá está el email
        } else {
            email = principal.toString();
        }

        System.out.println("[AdminService] 📧 Buscando usuario por email: " + email);

        return userRepository.findByEmail(email)
                .orElseGet(() -> {
                    System.out.println("[AdminService] ⚠️ Usuario no encontrado para email: " + email);
                    return null;
                });
    }

    @Override
    @Transactional
    public AdminDTO createAdmin(AdminDTO newAdmin) {
        if (newAdmin.getUserDTO() == null) {
            throw new IllegalArgumentException("Falta información del usuario");
        }


        User user = new User();
        user.setUsername(newAdmin.getUserDTO().getUsername());
        user.setPassword("admin123");
        user.setEmail(newAdmin.getUserDTO().getEmail());
        user.setRole(Role.ADMIN);

        user = userRepository.save(user);


        Admin admin = new Admin();
        admin.setUser(user);
        admin = adminRepository.save(admin);


        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole());

        AdminDTO responseDTO = new AdminDTO();
        responseDTO.setId(admin.getId());
        responseDTO.setUserDTO(userDTO);
        return responseDTO;
    }

    @Override
    public Optional<AdminDTO> getAdminById(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with id: " + id));

        UserDTO userDTO = new UserDTO();
        userDTO.setId(admin.getUser().getId());
        userDTO.setUsername(admin.getUser().getUsername());
        userDTO.setEmail(admin.getUser().getEmail());

        AdminDTO adminDTO = new AdminDTO();
        adminDTO.setId(admin.getId());
        adminDTO.setUserDTO(userDTO);

        // 🔹 Lógica ajustada para mostrar trialDaysLeft solo si corresponde
        Integer trialDaysLeft = calculateTrialDaysLeft(admin);
        if (trialDaysLeft != null && trialDaysLeft <= 0 &&
                admin.getPlan() != null &&
                !admin.getPlan().equalsIgnoreCase("PROFESSIONAL") &&
                !admin.getPlan().equalsIgnoreCase("TRIAL")) {
            // Si la prueba terminó y el plan cambió manualmente, no mostrar banner
            trialDaysLeft = null;
        }
        adminDTO.setTrialDaysLeft(trialDaysLeft);

        List<BuildingSummaryDTO> buildingSummaryDTO = admin.getBuildings().stream().map(building -> {
            BuildingSummaryDTO dto = new BuildingSummaryDTO();
            dto.setId(building.getId());
            dto.setName(building.getName());
            dto.setAddress(building.getAddress());
            return dto;
        }).collect(Collectors.toList());

        adminDTO.setBuildings(buildingSummaryDTO);

        return Optional.of(adminDTO);
    }


    @Override
    public ResponseEntity<String> updateAdmin(Long id, AdminDTO adminDTO) {

        if (adminDTO == null || adminDTO.getUserDTO() == null) {
            return new ResponseEntity<>("Falta información del administrador o usuario", HttpStatus.BAD_REQUEST);
        }


        Optional<Admin> optionalAdmin = adminRepository.findById(id);
        if (optionalAdmin.isEmpty()) {
            return new ResponseEntity<>("El admin con id: " + id + " no existe", HttpStatus.BAD_REQUEST);
        }


        Admin updateAdmin = optionalAdmin.get();


        User user = updateAdmin.getUser();
        if (user == null) {
            return new ResponseEntity<>("El admin no tiene un usuario asociado", HttpStatus.BAD_REQUEST);
        }


        if (adminDTO.getUserDTO().getUsername() != null) {
            user.setUsername(adminDTO.getUserDTO().getUsername());
        }
        if (adminDTO.getUserDTO().getEmail() != null) {
            user.setEmail(adminDTO.getUserDTO().getEmail());
        }


        try {
            adminRepository.save(updateAdmin);
            return new ResponseEntity<>("El admin se actualizó correctamente", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al actualizar el admin: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    @Transactional
    public ResponseEntity<String> deleteAdmin(Long id) {
        boolean adminExist = adminRepository.findById(id).isPresent();
        if (adminExist) {
            adminRepository.deleteById(id);
            return new ResponseEntity<>("Admin eliminado correctamente", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Admin no encontrado",HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    @Transactional
    public List<AdminDTO> findAll() {
        List<Admin> admins = adminRepository.findAll();
        List<AdminDTO> adminDTOS = new ArrayList<>();

        for (Admin admin : admins) {
            if (admin.getUser() != null) {
                UserDTO userDTO = UserDTO.builder()
                        .id(admin.getUser().getId())
                        .username(admin.getUser().getUsername())
                        .email(admin.getUser().getEmail())
                        .role(admin.getUser().getRole())
                        .fullName(admin.getUser().getFullName())
                        .build();

                List<BuildingSummaryDTO> buildingSummaries = new ArrayList<>();
                if (admin.getBuildings() != null) {
                    for (Building building : admin.getBuildings()) {
                        BuildingSummaryDTO summary = new BuildingSummaryDTO(
                                building.getId(),
                                building.getName(),
                                building.getAddress()
                        );
                        buildingSummaries.add(summary);
                    }
                }

                AdminDTO adminDTO = new AdminDTO();
                adminDTO.setId(admin.getId());
                adminDTO.setUserDTO(userDTO);
                adminDTO.setBuildings(buildingSummaries);

                adminDTOS.add(adminDTO);
            }
        }
        return adminDTOS;
    }

    @Override
    public boolean existsByUserId(Long userId) {
        return adminRepository.existsByUserId(userId);
    }

    public Long getLoggedUserAdminAccountId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetails) {
            String email = ((UserDetails) principal).getUsername();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null && user.getAdminAccount() != null) {
                return user.getAdminAccount().getId();
            }
        }
        return null;
    }
    @Override
    @Transactional
    public ResponseEntity<String> assignPlan(String email, String planName, String duration, Integer unitsPaid) {
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("El email es requerido.");
        }
        if (planName == null || planName.isBlank()) {
            return ResponseEntity.badRequest().body("El nombre del plan es requerido.");
        }
        if (duration == null || duration.isBlank()) {
            return ResponseEntity.badRequest().body("La duración del plan es requerida.");
        }
        if (unitsPaid == null || unitsPaid < 1) {
            return ResponseEntity.badRequest().body("La cantidad de unidades pagadas es requerida y debe ser mayor que 0.");
        }

        Optional<Admin> adminOpt = adminRepository.findByUserEmail(email);
        if (adminOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("No se encontró un admin con ese email.");
        }

        Admin admin = adminOpt.get();
        User user = admin.getUser();

        admin.setPlan(planName.toUpperCase());
        admin.setPlanDuration(duration.toLowerCase());
        admin.setUnitsPaid(unitsPaid);

        admin.setTrialStart(null);
        admin.setTrialEnd(null);

        LocalDate now = LocalDate.now();
        LocalDate subscriptionEnd;

        if (duration.equalsIgnoreCase("monthly")) {
            subscriptionEnd = now.plusMonths(1);
        } else if (duration.equalsIgnoreCase("yearly")) {
            subscriptionEnd = now.plusYears(1);
        } else {
            return ResponseEntity.badRequest().body("Duración inválida. Usa 'monthly' o 'yearly'.");
        }

        if (planName.equalsIgnoreCase("PREMIUM_PLUS")) {
            AdminAccount adminAccount = user.getAdminAccount();
            if (adminAccount == null) {

                adminAccount = new AdminAccount();
                adminAccount.setActive(true);
                adminAccount.setPlan("PREMIUM_PLUS");
                adminAccount.setCompanyName(user.getFullName());
                adminAccount.setSubscriptionStart(now);
                adminAccount.setSubscriptionEnd(subscriptionEnd);

                adminAccountRepository.save(adminAccount);

                user.setAdminAccount(adminAccount);
                userRepository.save(user);
            } else {

                adminAccount.setSubscriptionStart(now);
                adminAccount.setSubscriptionEnd(subscriptionEnd);
                adminAccount.setPlan("PREMIUM_PLUS");
                adminAccountRepository.save(adminAccount);
            }
        } else {
            if (user.getAdminAccount() != null) {
                AdminAccount oldAccount = user.getAdminAccount();
                user.setAdminAccount(null);
                userRepository.save(user);
                adminAccountRepository.delete(oldAccount);
            }
        }

        adminRepository.save(admin);

        return ResponseEntity.ok("Plan, duración y unidades pagadas asignados correctamente.");
    }







}
