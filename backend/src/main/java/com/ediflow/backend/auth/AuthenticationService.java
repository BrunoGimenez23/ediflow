package com.ediflow.backend.auth;

import com.ediflow.backend.configuration.JwtService;
import com.ediflow.backend.dto.user.UserDTO;
import com.ediflow.backend.entity.*;
import com.ediflow.backend.enums.Role;
import com.ediflow.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthenticationService {


    private static final String VALID_ADMIN_INVITE_CODE = "EDIFLOW-ADMIN-2025";

    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final IAdminRepository adminRepository;
    private final JwtService jwtService;
    private final IApartmentRepository apartmentRepository;
    private final IResidentRepository residentRepository;
    private final InvitationCodeRepository invitationCodeRepository;


    public AuthenticationResponse registerAdmin(RegisterRequest request) {

        InvitationCode code = invitationCodeRepository.findByCode(request.getInviteCode())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Código de invitación inválido"));

        if (!code.isActive() || code.getUsed() >= code.getMaxUses() || !"ADMIN".equals(code.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Código no válido o ya usado");
        }
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El nombre de usuario ya está en uso");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El email ya está registrado");
        }

        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ADMIN)
                .fullName(request.getFullName())
                .build();

        userRepository.save(user);

        var admin = new Admin();
        admin.setUser(user);
        adminRepository.save(admin);

        code.setUsed(code.getUsed() + 1);
        invitationCodeRepository.save(code);

        var token = jwtService.generateToken(user);

        var userDTO = UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .fullName(user.getFullName())
                .build();

        return AuthenticationResponse.builder()
                .token(token)
                .user(userDTO)
                .build();

    }


    public void registerResident(RegisterRequest request) {
        Apartment apartment = apartmentRepository.findById(request.getApartmentId())
                .orElseThrow(() -> new RuntimeException("Apartamento no encontrado"));

        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.RESIDENT)
                .fullName(request.getFullName())
                .build();

        userRepository.save(user);

        var resident = new Resident();
        resident.setUser(user);
        resident.setApartment(apartment);
        resident.setCi(request.getCi());
        residentRepository.save(resident);
    }

    public AuthenticationResponse login(AuthenticationRequest request) {

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));


        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }


        var token = jwtService.generateToken(user);

        var userDTO = UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .fullName(user.getFullName())
                .build();

        return AuthenticationResponse.builder()
                .token(token)
                .user(userDTO)
                .build();

    }



}
