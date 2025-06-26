package com.ediflow.backend.auth;

import com.ediflow.backend.dto.user.UserDTO;
import com.ediflow.backend.dto.user.UserResponseDTO;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.enums.Role;
import com.ediflow.backend.mapper.UserMapper;
import com.ediflow.backend.repository.IAdminRepository;
import com.ediflow.backend.repository.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.ediflow.backend.entity.Admin;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    private final IUserRepository userRepository;

    private final IAdminRepository adminRepository;

    @PostMapping("/register-admin")
    public ResponseEntity<AuthenticationResponse> registerAdmin(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.registerAdmin(request));
    }

    @PostMapping("/register-resident")
    public ResponseEntity<UserResponseDTO> registerResident(@RequestBody RegisterRequest request) {
        authenticationService.registerResident(request);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado después de creación"));

        UserResponseDTO response = UserMapper.toResponseDTO(user);

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

        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Long adminId = null;
        if (user.getRole() == Role.ADMIN) {
            adminId = adminRepository.findByUserId(user.getId())
                    .map(Admin::getId)
                    .orElse(null);
        }

        UserDTO userDTO = UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .fullName(user.getFullName())
                .adminId(adminId)
                .build();

        return ResponseEntity.ok(userDTO);
    }

}
