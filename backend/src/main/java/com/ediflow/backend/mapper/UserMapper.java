package com.ediflow.backend.mapper;

import com.ediflow.backend.dto.user.UserResponseDTO;
import com.ediflow.backend.entity.User;

public class UserMapper {

    public static UserResponseDTO toResponseDTO(User user) {
        if (user == null) return null;

        return UserResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .fullName(user.getFullName())
                .adminId(user.getAdmin() != null ? user.getAdmin().getId() : null)
                .build();
    }
}