package com.ediflow.backend.controller;

import com.ediflow.backend.dto.user.CreateUserRequestDTO;
import com.ediflow.backend.dto.user.UserDTO;
import com.ediflow.backend.dto.user.UserResponseDTO;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.repository.IUserRepository;
import com.ediflow.backend.service.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;

    private final IUserRepository userRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(
            @AuthenticationPrincipal(expression = "username") String email,
            @RequestBody @Valid CreateUserRequestDTO request) {

        User currentUser = userService.findByEmail(email);

        if (currentUser.getAdminAccount() == null) {
            throw new RuntimeException("El usuario no tiene cuenta administradora asociada");
        }

        Long adminAccountId = currentUser.getAdminAccount().getId();
        UserResponseDTO createdUser = userService.createUser(request, adminAccountId);
        return ResponseEntity.ok(createdUser);
    }


    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getUsersByAccount(@AuthenticationPrincipal(expression = "username") String email) {
        User currentUser = userService.findByEmail(email);

        if (currentUser.getAdminAccount() == null) {
            throw new RuntimeException("El usuario no tiene cuenta administradora asociada");
        }

        Long adminAccountId = currentUser.getAdminAccount().getId();
        List<UserResponseDTO> users = userService.getUsersByAdminAccount(adminAccountId);
        return ResponseEntity.ok(users);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @AuthenticationPrincipal(expression = "username") String email,
            @PathVariable Long id) {

        User currentUser = userService.findByEmail(email);

        if (currentUser.getAdminAccount() == null) {
            return ResponseEntity.badRequest().build();
        }

        boolean deleted = userService.deleteUserByIdIfBelongsToAccount(id, currentUser.getAdminAccount().getId());

        if (!deleted) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(
            @AuthenticationPrincipal(expression = "username") String email,
            @PathVariable Long id,
            @RequestBody @Valid CreateUserRequestDTO request) {

        User currentUser = userService.findByEmail(email);

        if (currentUser.getAdminAccount() == null) {
            return ResponseEntity.badRequest().build();
        }

        Long adminAccountId = currentUser.getAdminAccount().getId();

        UserResponseDTO updatedUser = userService.updateUser(id, request, adminAccountId);

        if (updatedUser == null) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(updatedUser);
    }
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @GetMapping("/by-email")
    public ResponseEntity<UserDTO> getUserByEmail(@RequestParam String email) {
        return userRepository.findByEmail(email)
                .map(user -> {
                    UserDTO userDTO = UserDTO.builder()
                            .id(user.getId())
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .role(user.getRole())
                            .fullName(user.getFullName())
                            .adminId(user.getAdminAccount() != null ? user.getAdminAccount().getId() : null)
                            .plan(user.getAdminAccount() != null ? user.getAdminAccount().getPlan() : null)
                            .trialDaysLeft(null) // O calculalo si querés
                            .build();
                    return ResponseEntity.ok(userDTO);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
