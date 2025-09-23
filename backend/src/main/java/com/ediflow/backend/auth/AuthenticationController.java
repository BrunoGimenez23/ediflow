package com.ediflow.backend.auth;

import com.ediflow.backend.dto.marketplace.RegisterRequestDTO;
import com.ediflow.backend.dto.user.UserDTO;
import com.ediflow.backend.dto.user.UserResponseDTO;
import com.ediflow.backend.entity.AdminAccount;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.enums.Role;
import com.ediflow.backend.mapper.UserMapper;
import com.ediflow.backend.repository.IAdminRepository;
import com.ediflow.backend.repository.IUserRepository;
import com.ediflow.backend.repository.marketplace.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.ediflow.backend.entity.Admin;



@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    private final IUserRepository userRepository;

    private final IAdminRepository adminRepository;
    private final ProviderRepository providerRepository;

    @PostMapping("/register-admin")
    public ResponseEntity<AuthenticationResponse> registerAdmin(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.registerAdmin(request));
    }

    @PostMapping("/register-resident")
    public ResponseEntity<UserResponseDTO> registerResident(@RequestBody RegisterRequest request) {
        authenticationService.registerResident(request);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado después de creación"));


        UserResponseDTO response = new UserResponseDTO();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setFullName(user.getFullName());


        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) {
        var response = authenticationService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();
        System.out.println("Email desde Authentication: " + email);

        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        System.out.println("=== DEBUG BACKEND ===");
        System.out.println("Usuario: " + user.getUsername());
        System.out.println("Role: " + user.getRole());
        System.out.println("AdminAccount: " + user.getAdminAccount());

        Long adminId = null;
        Integer trialDaysLeft = null;
        String plan = null;
        Long buildingId = null;
        Long providerId = null; // 👈 nuevo

        if (user.getRole() == Role.ADMIN) {
            System.out.println("Entrando en bloque ADMIN");

            var adminOpt = adminRepository.findByUserId(user.getId());
            if (adminOpt.isPresent()) {
                Admin admin = adminOpt.get();
                adminId = admin.getId();

                if (admin.getTrialEnd() != null) {
                    var today = java.time.LocalDate.now();
                    if (!admin.getTrialEnd().isBefore(today)) {
                        trialDaysLeft = (int) java.time.temporal.ChronoUnit.DAYS.between(today, admin.getTrialEnd());
                    } else {
                        trialDaysLeft = 0;
                    }
                }

                // Si está en periodo de prueba y no tiene plan, asignar "PROFESIONAL" temporalmente
                if (admin.getPlan() == null && trialDaysLeft != null && trialDaysLeft > 0) {
                    plan = "PROFESIONAL";
                } else {
                    plan = admin.getPlan();
                }
            }
        } else {
            if (user.getAdminAccount() != null) {
                System.out.println("AdminAccount encontrado, obteniendo datos...");
                AdminAccount adminAccount = user.getAdminAccount();
                adminId = adminAccount.getId();
                plan = adminAccount.getPlan();
                System.out.println("AdminId obtenido: " + adminId);
                System.out.println("Plan obtenido: " + plan);

                if (adminAccount.getSubscriptionEnd() != null) {
                    var today = java.time.LocalDate.now();
                    if (!adminAccount.getSubscriptionEnd().isBefore(today)) {
                        trialDaysLeft = (int) java.time.temporal.ChronoUnit.DAYS.between(today, adminAccount.getSubscriptionEnd());
                    } else {
                        System.out.println("ERROR: AdminAccount es null");
                        trialDaysLeft = 0;
                    }
                }
                System.out.println("AdminId final: " + adminId);
                System.out.println("Plan final: " + plan);
                System.out.println("====================");
            }
        }

        // Asignar buildingId dependiendo del rol
        if (user.getRole() == Role.PORTER && user.getBuilding() != null) {
            buildingId = user.getBuilding().getId();
        } else if (user.getResident() != null && user.getResident().getBuilding() != null) {
            buildingId = user.getResident().getBuilding().getId();
        }

        // 👇 Nuevo bloque para Provider
        if (user.getRole() == Role.PROVIDER) {
            var providerOpt = providerRepository.findByUserId(user.getId());
            if (providerOpt.isPresent()) {
                providerId = providerOpt.get().getId();
            }
        }

        UserDTO userDTO = UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .fullName(user.getFullName())
                .adminId(adminId)
                .trialDaysLeft(trialDaysLeft)
                .plan(plan)
                .buildingId(buildingId)
                .providerId(providerId)
                .build();

        return ResponseEntity.ok(userDTO);
    }


    @PostMapping("/register-provider")
    public ResponseEntity<AuthenticationResponse> registerProvider(@RequestBody RegisterRequestDTO request) {
        AuthenticationResponse response = authenticationService.registerProvider(request);
        return ResponseEntity.ok(response);
    }
}