package com.ediflow.backend.service.impl;

import com.ediflow.backend.dto.user.CreateUserRequestDTO;
import com.ediflow.backend.dto.user.UserResponseDTO;
import com.ediflow.backend.entity.AdminAccount;
import com.ediflow.backend.entity.User;
import com.ediflow.backend.exception.ConflictException;
import com.ediflow.backend.exception.ForbiddenOperationException;
import com.ediflow.backend.mapper.UserMapper;
import com.ediflow.backend.repository.IAdminAccountRepository;
import com.ediflow.backend.repository.IUserRepository;
import com.ediflow.backend.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {

    private final IUserRepository userRepository;
    private final IAdminAccountRepository adminAccountRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public UserResponseDTO createUser(CreateUserRequestDTO request, Long adminAccountId) {
        AdminAccount adminAccount = adminAccountRepository.findById(adminAccountId)
                .orElseThrow(() -> new RuntimeException("Admin account not found"));


        if (!"PREMIUM_PLUS".equalsIgnoreCase(adminAccount.getPlan())) {
            throw new ForbiddenOperationException("Solo admins con plan PREMIUM_PLUS pueden crear usuarios secundarios");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ConflictException("El email ya está registrado");
        }
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new ConflictException("El nombre de usuario ya está en uso");
        }

        User user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .fullName(request.getFullName())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .adminAccount(adminAccount)
                .build();

        userRepository.save(user);

        return UserResponseDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole())
                .adminId(adminAccountId)
                .plan(adminAccount.getPlan())
                .build();
    }
    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));
    }

    @Override
    public List<UserResponseDTO> getUsersByAdminAccount(Long adminAccountId) {
        return userRepository.findByAdminAccountId(adminAccountId).stream()
                .map(user -> UserResponseDTO.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .username(user.getUsername())
                        .fullName(user.getFullName())
                        .role(user.getRole())
                        .adminId(adminAccountId)
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public boolean deleteUserByIdIfBelongsToAccount(Long userId, Long adminAccountId) {
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getAdminAccount() != null &&
                    user.getAdminAccount().getId().equals(adminAccountId)) {
                userRepository.delete(user);
                return true;
            }
        }

        return false;
    }

    @Override
    public UserResponseDTO updateUser(Long userId, CreateUserRequestDTO request, Long adminAccountId) {
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) return null;

        User user = userOpt.get();

        if (user.getAdminAccount() == null || !user.getAdminAccount().getId().equals(adminAccountId)) {
            return null;
        }

        user.setFullName(request.getFullName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());


        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userRepository.save(user);

        return UserMapper.toResponseDTO(user);
    }
    @Override
    public Optional<AdminAccount> getAdminAccountById(Long id) {
        return adminAccountRepository.findById(id);
    }
    @Override
    public Optional<User> findByEmailOptional(String email) {
        return userRepository.findByEmail(email);
    }
}
