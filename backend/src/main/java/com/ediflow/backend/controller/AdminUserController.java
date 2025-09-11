package com.ediflow.backend.controller;

import com.ediflow.backend.dto.user.CreateUserRequestDTO;
import com.ediflow.backend.dto.user.UserResponseDTO;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.exception.ConflictException;
import com.ediflow.backend.exception.ForbiddenOperationException;
import com.ediflow.backend.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final IUserService userService;

    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(
            @RequestBody CreateUserRequestDTO request,
            Authentication authentication) {
        try {
            User currentUser = (User) authentication.getPrincipal();

            if (currentUser.getRole() != com.ediflow.backend.enums.Role.ADMIN) {
                return ResponseEntity.status(403).build();
            }

            Long adminAccountId = currentUser.getAdminAccount().getId();

            UserResponseDTO createdUser = userService.createUser(request, adminAccountId);
            return ResponseEntity.ok(createdUser);
        } catch (ForbiddenOperationException ex) {
            return ResponseEntity.status(403).body(null);
        } catch (ConflictException ex) {
            return ResponseEntity.status(409).body(null);
        }
    }
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @GetMapping("/by-email")
    public ResponseEntity<UserResponseDTO> getUserByEmail(@RequestParam String email) {
        return userService.findByEmailOptional(email)
                .map(user -> {
                    UserResponseDTO dto = UserResponseDTO.builder()
                            .id(user.getId())
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .role(user.getRole())
                            .fullName(user.getFullName())
                            .adminId(user.getAdminAccount() != null ? user.getAdminAccount().getId() : null)
                            .plan(user.getAdminAccount() != null ? user.getAdminAccount().getPlan() : null)
                            .build();
                    return ResponseEntity.ok(dto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/porter")
    public ResponseEntity<UserResponseDTO> createPorter(
            @RequestBody CreateUserRequestDTO request,
            Authentication authentication) {
        try {
            User currentUser = (User) authentication.getPrincipal();

            // Solo admins con plan PREMIUM_PLUS
            if (currentUser.getRole() != com.ediflow.backend.enums.Role.ADMIN ||
                    currentUser.getAdminAccount() == null ||
                    !"PREMIUM_PLUS".equalsIgnoreCase(currentUser.getAdminAccount().getPlan())) {
                throw new ForbiddenOperationException("Solo admins PREMIUM_PLUS pueden crear porteros");
            }

            // Usamos el método específico de UserService
            UserResponseDTO createdPorter = userService.createPorter(request, currentUser.getAdminAccount().getId());

            return ResponseEntity.ok(createdPorter);

        } catch (ForbiddenOperationException ex) {
            return ResponseEntity.status(403).body(null);
        } catch (ConflictException ex) {
            return ResponseEntity.status(409).body(null);
        }
    }


}
