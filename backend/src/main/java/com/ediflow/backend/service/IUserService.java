package com.ediflow.backend.service;

import com.ediflow.backend.dto.user.CreateUserRequestDTO;
import com.ediflow.backend.dto.user.UserResponseDTO;
import com.ediflow.backend.entity.AdminAccount;
import com.ediflow.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Optional;


public interface IUserService {
    Optional<User> findById(Long id);
    UserResponseDTO createUser(CreateUserRequestDTO request, Long adminAccountId);
    List<UserResponseDTO> getUsersByAdminAccount(Long adminAccountId);
    User findByEmail(String email);
    boolean deleteUserByIdIfBelongsToAccount(Long userId, Long adminAccountId);
    UserResponseDTO updateUser(Long userId, CreateUserRequestDTO request, Long adminAccountId);
    Optional<AdminAccount> getAdminAccountById(Long id);
    Optional<User> findByEmailOptional(String email);
}
