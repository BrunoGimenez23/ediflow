package com.ediflow.backend.auth;

import com.ediflow.backend.configuration.JwtService;
import com.ediflow.backend.entity.Admin;
import com.ediflow.backend.entity.Apartment;
import com.ediflow.backend.entity.Resident;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.enums.Role;
import com.ediflow.backend.repository.IAdminRepository;
import com.ediflow.backend.repository.IApartmentRepository;
import com.ediflow.backend.repository.IResidentRepository;
import com.ediflow.backend.repository.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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


    public AuthenticationResponse registerAdmin(RegisterRequest request) {

        if (!VALID_ADMIN_INVITE_CODE.equals(request.getInviteCode())) {
            throw new RuntimeException("Código de invitación inválido");
        }

        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ADMIN)
                .build();

        userRepository.save(user);

        var admin = new Admin();
        admin.setUser(user);
        adminRepository.save(admin);

        var token = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
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
                .build();

        userRepository.save(user);

        var resident = new Resident();
        resident.setUser(user);
        resident.setApartment(apartment);
        residentRepository.save(resident);
    }

    public AuthenticationResponse login(AuthenticationRequest request) {

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));


        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }


        var token = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .build();

    }



}
